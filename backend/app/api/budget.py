from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from typing import List

from app.db.session import get_session
from app.models.base import BudgetCategory, User
from app.schemas.budget import CategoryCreate, CategoryRead
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

# 3. 🟢 Endpoint de ESTADO DEL PRESUPUESTO (Alertas)
@router.get("/status")
def check_budget_status(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """
    Retorna el estado de salud de cada categoría y alertas si superan umbrales.
    Calcula dinámicamente el porcentaje gastado.
    """
    # Obtenemos las categorías del usuario
    categories = session.exec(
        select(BudgetCategory).where(BudgetCategory.user_id == current_user.id)
    ).all()
    
    status_report = []
    
    for cat in categories:
        # Solo analizamos si hay un límite definido mayor a 0
        if cat.limit_amount > 0:
            percentage = (cat.spent_amount / cat.limit_amount) * 100
            
            # Determinamos el nivel de alerta
            alert_level = "normal"
            message = "Todo bajo control"
            
            if percentage >= 100:
                alert_level = "critical"
                message = f"¡Has excedido tu presupuesto en {cat.name}!"
            elif percentage >= 85:
                alert_level = "warning"
                message = f"Cuidado: Estás al {int(percentage)}% en {cat.name}"
                
            status_report.append({
                "category": cat.name,
                "spent": cat.spent_amount,
                "limit": cat.limit_amount,
                "percentage": round(percentage, 1),
                "alert": alert_level, # normal, warning, critical
                "message": message
            })
            
    return status_report