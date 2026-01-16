from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from typing import List

from app.db.session import get_session
from app.models.base import Debt, User
from app.schemas.debt import DebtCreate, DebtRead
from app.core.security import get_current_user

router = APIRouter()

# 1. Crear Deuda (Protegido)
@router.post("/", response_model=DebtRead)
def create_debt(
    debt: DebtCreate, 
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user) # 🔒
):
    debt_data = debt.model_dump()
    debt_data.pop("user_id", None)

    db_debt = Debt(**debt_data)
    db_debt.user_id = current_user.id
    
    session.add(db_debt)
    session.commit()
    session.refresh(db_debt)
    return db_debt

# 2. Leer Deudas (Filtrado)
@router.get("/", response_model=List[DebtRead])
def read_debts(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user) # 🔒
):
    # 🔒 Filtrar por usuario
    debts = session.exec(
        select(Debt).where(Debt.user_id == current_user.id)
    ).all()
    return debts