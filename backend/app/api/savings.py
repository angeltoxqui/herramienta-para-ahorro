from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from typing import List

from app.db.session import get_session
from app.models.base import SavingGoal, User
from app.schemas.saving import SavingCreate, SavingRead
from app.core.security import get_current_user

router = APIRouter()

# 1. Crear Meta de Ahorro (Protegido)
@router.post("/", response_model=SavingRead)
def create_saving_goal(
    saving: SavingCreate, 
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user) # 🔒
):
    saving_data = saving.model_dump()
    saving_data.pop("user_id", None)

    db_saving = SavingGoal(**saving_data)
    db_saving.user_id = current_user.id
    
    session.add(db_saving)
    session.commit()
    session.refresh(db_saving)
    return db_saving

# 2. Leer Metas (Filtrado)
@router.get("/", response_model=List[SavingRead])
def read_saving_goals(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user) # 🔒
):
    # 🔒 Filtrar por usuario
    goals = session.exec(
        select(SavingGoal).where(SavingGoal.user_id == current_user.id)
    ).all()
    return goals