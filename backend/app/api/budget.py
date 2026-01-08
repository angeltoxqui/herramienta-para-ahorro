from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from typing import List

# Importamos la conexión a la DB
from app.db.session import get_session

# Importamos la tabla de la base de datos (Modelo)
from app.models.base import BudgetCategory

# Importamos los esquemas de datos (lo que entra y sale)
from app.schemas.budget import CategoryCreate, CategoryRead

# 👇 ESTA LÍNEA ES LA CLAVE (Aquí se define la variable 'router')
router = APIRouter()

# 1. Endpoint para CREAR una categoría
@router.post("/", response_model=CategoryRead)
def create_category(category: CategoryCreate, session: Session = Depends(get_session)):
    # Convertimos el esquema a modelo de base de datos
    db_category = BudgetCategory.model_validate(category)
    
    # Guardamos en la base de datos
    session.add(db_category)
    session.commit()
    session.refresh(db_category)
    
    return db_category

# 2. Endpoint para LEER todas las categorías
@router.get("/", response_model=List[CategoryRead])
def read_categories(session: Session = Depends(get_session)):
    categories = session.exec(select(BudgetCategory)).all()
    return categories