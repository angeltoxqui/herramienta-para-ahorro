from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from typing import List

from app.db.session import get_session
from app.models.base import BudgetCategory, User
from app.schemas.budget import CategoryCreate, CategoryRead
from app.core.security import get_current_user

router = APIRouter()

# 1. Crear Categoría
@router.post("/", response_model=CategoryRead)
def create_category(
    category: CategoryCreate, 
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    category_data = category.model_dump()
    category_data.pop("user_id", None)
    
    db_category = BudgetCategory(**category_data)
    db_category.user_id = current_user.id
    
    session.add(db_category)
    session.commit()
    session.refresh(db_category)
    
    return db_category

# 2. Leer Categorías
@router.get("/", response_model=List[CategoryRead])
def read_categories(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    categories = session.exec(
        select(BudgetCategory).where(BudgetCategory.user_id == current_user.id)
    ).all()
    return categories

# 3. Estado del Presupuesto (Alertas)
@router.get("/status")
def check_budget_status(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    categories = session.exec(
        select(BudgetCategory).where(BudgetCategory.user_id == current_user.id)
    ).all()
    
    status_report = []
    
    for cat in categories:
        # Sumamos límite base + lo que sobró del mes anterior
        total_limit = cat.limit_amount + cat.rollover_amount
        
        if total_limit > 0:
            percentage = (cat.spent_amount / total_limit) * 100
            
            alert_level = "normal"
            message = "Todo bajo control"
            
            if percentage >= 100:
                alert_level = "critical"
                message = f"¡Excedido en {cat.name}!"
            elif percentage >= 85:
                alert_level = "warning"
                message = f"Cuidado: {int(percentage)}% gastado"
                
            status_report.append({
                "category": cat.name,
                "spent": cat.spent_amount,
                "limit": total_limit, # Enviamos el límite real (base + bono)
                "percentage": round(percentage, 1),
                "alert": alert_level,
                "message": message
            })
            
    return status_report

# 4. 🟢 Cierre de Mes (Rollover)
@router.post("/reset-month")
def reset_budget_month(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """
    Cierra el mes: Mueve el sobrante al rollover y reinicia gastos a 0.
    """
    categories = session.exec(
        select(BudgetCategory).where(BudgetCategory.user_id == current_user.id)
    ).all()
    
    results = []
    
    for cat in categories:
        total_available = cat.limit_amount + cat.rollover_amount
        remaining = total_available - cat.spent_amount
        
        # Solo hacemos rollover si sobró dinero (no arrastramos deudas negativas)
        new_rollover = remaining if remaining > 0 else 0.0
        
        results.append({
            "category": cat.name,
            "previous_spent": cat.spent_amount,
            "rolled_over": round(new_rollover, 2)
        })
        
        # Actualizamos
        cat.rollover_amount = new_rollover
        cat.spent_amount = 0.0
        session.add(cat)
        
    session.commit()
    return {"message": "Mes cerrado exitosamente", "details": results}