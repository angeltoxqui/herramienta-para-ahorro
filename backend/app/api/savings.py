from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from typing import List

from app.db.session import get_session
from app.models.base import SavingGoal
from app.schemas.saving import SavingCreate, SavingRead

router = APIRouter()

# 1. Crear Meta de Ahorro
@router.post("/", response_model=SavingRead)
def create_saving_goal(saving: SavingCreate, session: Session = Depends(get_session)):
    db_saving = SavingGoal.model_validate(saving)
    session.add(db_saving)
    session.commit()
    session.refresh(db_saving)
    return db_saving

# 2. Leer Metas
@router.get("/", response_model=List[SavingRead])
def read_saving_goals(session: Session = Depends(get_session)):
    goals = session.exec(select(SavingGoal)).all()
    return goals