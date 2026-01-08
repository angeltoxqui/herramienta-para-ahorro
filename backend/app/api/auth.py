from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session, select
from typing import Any

from app.db.session import get_session
from app.models.base import User
from app.core.security import verify_password, create_access_token

router = APIRouter()

@router.post("/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(), # FastAPI maneja el formulario standard
    session: Session = Depends(get_session)
) -> Any:
    # 1. Buscar usuario por email (form_data.username se usa para el email)
    user = session.exec(select(User).where(User.email == form_data.username)).first()
    
    # 2. Verificar si existe y si la contraseña coincide
    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=400, 
            detail="Email o contraseña incorrectos"
        )
    
    # 3. Si todo ok, crear Token
    return {
        "access_token": create_access_token(subject=user.id),
        "token_type": "bearer",
        "user_name": user.full_name,
        "is_premium": user.is_premium
    }