from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from app.db.session import get_session
from app.models.base import User
from app.schemas.user import UserCreate, UserRead
# 👇 Importamos la seguridad
from app.core.security import get_password_hash 

router = APIRouter()

@router.post("/", response_model=UserRead)
def create_user(user: UserCreate, session: Session = Depends(get_session)):
    # 1. Verificar si el email ya existe
    existing_user = session.exec(select(User).where(User.email == user.email)).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="El email ya está registrado")

    # 2. Guardar usuario con contraseña ENCRIPTADA
    db_user = User(
        email=user.email,
        password_hash=get_password_hash(user.password), # 👈 ¡Magia aquí!
        full_name=user.full_name,
        is_premium=False
    )
    session.add(db_user)
    session.commit()
    session.refresh(db_user)
    return db_user