from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import List

from app.db.session import get_session
from app.models.base import Transaction
from app.schemas.transaction import TransactionCreate, TransactionRead

router = APIRouter()

# 1. Crear una transacción (POST)
@router.post("/", response_model=TransactionRead)
def create_transaction(transaction: TransactionCreate, session: Session = Depends(get_session)):
    # Convertimos el esquema a modelo de base de datos
    db_transaction = Transaction.model_validate(transaction)
    
    session.add(db_transaction)
    session.commit()
    session.refresh(db_transaction)
    return db_transaction

# 2. Leer todas las transacciones (GET)
@router.get("/", response_model=List[TransactionRead])
def read_transactions(session: Session = Depends(get_session)):
    transactions = session.exec(select(Transaction)).all()
    return transactions