from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from typing import List

# Importamos la conexión a la DB
from app.db.session import get_session

# Importamos la tabla de la base de datos (Modelo) y el modelo de Usuario
from app.models.base import BudgetCategory, User

# Importamos los esquemas de datos
from app.schemas.budget import CategoryCreate, CategoryRead

# Importamos la seguridad para obtener el usuario actual
from app.core.security import get_current_user

router = APIRouter()

# 1. Endpoint para CREAR una categoría (Protegido)
@router.post("/", response_model=CategoryRead)
def create_category(
    category: CategoryCreate, 
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user) # 🔒 Requiere token
):
    category_data = category.model_dump()
    category_data.pop("user_id", None)
    
    db_category = BudgetCategory(**category_data)
    db_category.user_id = current_user.id
    
    
    # Guardamos en la base de datos
    session.add(db_category)
    session.commit()
    session.refresh(db_category)
    
    return db_category

# 2. Endpoint para LEER todas las categorías (Protegido y Filtrado)
@router.get("/", response_model=List[CategoryRead])
def read_categories(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user) # 🔒 Requiere token
):
    # 🔒 Solo devolvemos las categorías que pertenecen al usuario actual
    categories = session.exec(
        select(BudgetCategory).where(BudgetCategory.user_id == current_user.id)
    ).all()
    return categories