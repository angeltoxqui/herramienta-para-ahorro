from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import List

from app.db.session import get_session
# Importamos SavingGoal además de las otras tablas
from app.models.base import Transaction, User, BudgetCategory, Debt, SavingGoal
from app.schemas.transaction import TransactionCreate, TransactionRead
from app.core.security import get_current_user

router = APIRouter()

@router.post("/", response_model=TransactionRead)
def create_transaction(
    transaction: TransactionCreate, 
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    transaction_data = transaction.model_dump()
    # Eliminamos user_id si viniera en el body para usar el del token seguro
    transaction_data.pop("user_id", None)
    
    db_transaction = Transaction(**transaction_data)
    db_transaction.user_id = current_user.id 
    session.add(db_transaction)
    
    # 1. LÓGICA DE PRESUPUESTO (Gasto normal)
    # Solo afectamos el presupuesto si es un gasto y tiene categoría
    if db_transaction.type == "expense" and db_transaction.category:
        category = session.exec(
            select(BudgetCategory)
            .where(BudgetCategory.user_id == current_user.id)
            .where(BudgetCategory.name == db_transaction.category)
        ).first()
        if category:
            category.spent_amount += db_transaction.amount
            session.add(category)

    # 2. LÓGICA DE DEUDAS (Abono a Capital)
    if db_transaction.debt_id:
        debt = session.get(Debt, db_transaction.debt_id)
        if debt and debt.user_id == current_user.id:
            debt.current_balance -= db_transaction.amount
            if debt.current_balance < 0:
                debt.current_balance = 0
            session.add(debt)

    # 3. 🟢 LÓGICA DE METAS DE AHORRO (Asignación de Fondos)
    if db_transaction.saving_goal_id:
        goal = session.get(SavingGoal, db_transaction.saving_goal_id)
        # Verificamos que la meta exista y pertenezca al usuario
        if goal and goal.user_id == current_user.id:
            goal.current_amount += db_transaction.amount
            # Opcional: Podrías validar aquí si goal.current_amount > goal.target_amount
            session.add(goal)
    
    session.commit()
    session.refresh(db_transaction)
    return db_transaction

@router.get("/", response_model=List[TransactionRead])
def read_transactions(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    transactions = session.exec(
        select(Transaction).where(Transaction.user_id == current_user.id)
    ).all()
    return transactions