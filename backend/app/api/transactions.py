from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import List

from app.db.session import get_session
from app.models.base import Transaction, User
from app.schemas.transaction import TransactionCreate, TransactionRead
# Importamos la dependencia de seguridad
from app.core.security import get_current_user

router = APIRouter()

@router.post("/", response_model=TransactionRead)
def create_transaction(
    transaction: TransactionCreate, 
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    # 1. Convertimos el input a un diccionario limpio
    transaction_data = transaction.model_dump()
    
    # 2. Eliminamos 'user_id' del diccionario si viene como None
    transaction_data.pop("user_id", None)
    
    # 3. Creamos el modelo usando el diccionario
    db_transaction = Transaction(**transaction_data)
    
    # 4. Asignamos el ID del usuario autenticado MANUALMENTE
    db_transaction.user_id = current_user.id 
    
    session.add(db_transaction)
    session.commit()
    session.refresh(db_transaction)
    return db_transaction

@router.get("/", response_model=List[TransactionRead])
def read_transactions(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user) # 🔒 Usuario autenticado
):
    # ⚡ FILTRAMOS solo las transacciones de este usuario
    transactions = session.exec(
        select(Transaction).where(Transaction.user_id == current_user.id)
    ).all()
    return transactions