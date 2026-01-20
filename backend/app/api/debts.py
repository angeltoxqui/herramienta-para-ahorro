from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import List

from app.db.session import get_session
from app.models.base import Debt, User
from app.schemas.debt import DebtCreate, DebtRead
from app.core.security import get_current_user

router = APIRouter()

@router.post("/", response_model=DebtRead)
def create_debt(
    debt: DebtCreate, 
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    debt_data = debt.model_dump()
    debt_data.pop("user_id", None)

    db_debt = Debt(**debt_data)
    db_debt.user_id = current_user.id
    
    session.add(db_debt)
    session.commit()
    session.refresh(db_debt)
    return db_debt

@router.get("/", response_model=List[DebtRead])
def read_debts(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    debts = session.exec(
        select(Debt).where(Debt.user_id == current_user.id)
    ).all()
    return debts

# 🟢 NUEVO: Simulación de Intereses (Background Job Trigger)
@router.post("/apply-interests")
def apply_monthly_interests(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """
    Recorre todas las deudas del usuario y les suma el interés mensual.
    Fórmula: (Saldo * Tasa Anual / 12) / 100
    """
    debts = session.exec(
        select(Debt).where(Debt.user_id == current_user.id)
    ).all()
    
    results = []
    
    for debt in debts:
        if debt.current_balance > 0 and debt.interest_rate > 0:
            # Calculamos interés mensual
            monthly_rate = debt.interest_rate / 12
            interest_amount = debt.current_balance * (monthly_rate / 100)
            
            # Actualizamos deuda
            debt.current_balance += interest_amount
            session.add(debt)
            
            results.append({
                "debt": debt.name,
                "added_interest": round(interest_amount, 2),
                "new_balance": round(debt.current_balance, 2)
            })
            
    session.commit()
    return {"message": "Intereses aplicados exitosamente", "details": results}