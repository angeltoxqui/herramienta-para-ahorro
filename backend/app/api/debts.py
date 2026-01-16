from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from typing import List

from app.db.session import get_session
from app.models.base import Debt
from app.schemas.debt import DebtCreate, DebtRead

router = APIRouter()

# 1. Crear Deuda
@router.post("/", response_model=DebtRead)
def create_debt(debt: DebtCreate, session: Session = Depends(get_session)):
    db_debt = Debt.model_validate(debt)
    session.add(db_debt)
    session.commit()
    session.refresh(db_debt)
    return db_debt

# 2. Leer Deudas
@router.get("/", response_model=List[DebtRead])
def read_debts(session: Session = Depends(get_session)):
    debts = session.exec(select(Debt)).all()
    return debts