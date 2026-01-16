from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import List, Dict
from datetime import timedelta
from collections import defaultdict

from app.db.session import get_session
from app.models.base import Transaction, RecurringExpense, User
from app.core.security import get_current_user

router = APIRouter()

@router.post("/scan-recurring", response_model=List[RecurringExpense])
def scan_recurring_expenses(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """
    🧠 CEREBRO DEL DETECTIVE FINANCIERO:
    1. Busca todas las transacciones del usuario.
    2. Agrupa por descripción similar.
    3. Detecta si ocurren mensualmente y con montos parecidos.
    4. Guarda los hallazgos en la tabla RecurringExpense.
    """
    
    # 1. Obtener historial (últimos 90 días es un buen rango)
    # Para simplificar, traemos todas, pero en prod podrías filtrar por fecha.
    transactions = session.exec(
        select(Transaction).where(Transaction.user_id == current_user.id)
    ).all()

    if not transactions:
        return []

    # 2. Agrupamiento Lógico (Normalizamos nombres: "Spotify " -> "spotify")
    grouped_tx: Dict[str, List[Transaction]] = defaultdict(list)
    for tx in transactions:
        clean_name = tx.description.strip().lower()
        grouped_tx[clean_name].append(tx)

    detected_expenses = []

    # 3. Análisis de Patrones
    for name, tx_list in grouped_tx.items():
        # Regla A: Debe haber al menos 3 transacciones para considerar "patrón"
        if len(tx_list) < 3:
            continue
            
        # Ordenamos por fecha para analizar intervalos
        tx_list.sort(key=lambda x: x.date)
        
        # Analizamos intervalos entre fechas
        is_monthly = True
        total_amount = 0.0
        
        for i in range(1, len(tx_list)):
            prev_date = tx_list[i-1].date
            curr_date = tx_list[i].date
            
            days_diff = (curr_date - prev_date).days
            
            # Regla B: Intervalo mensual (entre 25 y 35 días)
            if not (25 <= days_diff <= 35):
                is_monthly = False
                break
            
            total_amount += tx_list[i].amount

        # Si cumple patrón mensual, calculamos promedio y guardamos
        if is_monthly:
            avg_amount = total_amount / (len(tx_list) - 1) # Promedio simple
            
            # Verificar si ya existe este gasto detectado para no duplicar
            existing = session.exec(
                select(RecurringExpense)
                .where(RecurringExpense.user_id == current_user.id)
                .where(RecurringExpense.name == name)
            ).first()

            if not existing:
                # 💡 ¡EUREKA! Nuevo gasto silencioso encontrado
                new_recurrence = RecurringExpense(
                    user_id=current_user.id,
                    name=name.title(), # Lo ponemos bonito "spotify" -> "Spotify"
                    amount=round(avg_amount, 2),
                    frequency="monthly",
                    detected_day=tx_list[-1].date.day, # Usamos el día del último cobro
                    confidence_score=0.9, # Estamos 90% seguros
                    is_confirmed=False # El usuario debe aprobarlo
                )
                session.add(new_recurrence)
                detected_expenses.append(new_recurrence)

    session.commit()
    
    # Refrescamos los objetos para devolverlos con ID real
    for exp in detected_expenses:
        session.refresh(exp)
        
    return detected_expenses

@router.get("/", response_model=List[RecurringExpense])
def get_detected_expenses(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """Devuelve la lista de gastos recurrentes ya detectados"""
    return session.exec(
        select(RecurringExpense).where(RecurringExpense.user_id == current_user.id)
    ).all()

@router.patch("/{expense_id}")
def respond_to_detected_expense(
    expense_id: int,
    action: str, # Esperamos "confirm" o "ignore"
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    # 1. Buscar el gasto
    expense = session.get(RecurringExpense, expense_id)
    
    # 2. Seguridad: Verificar que exista y sea de este usuario
    if not expense or expense.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Gasto no encontrado")
    
    # 3. Aplicar la acción
    if action == "confirm":
        expense.is_confirmed = True
        # ¡Aquí podrías agregar lógica extra! (Ej: Crear automáticamente un BudgetCategory)
    elif action == "ignore":
        expense.is_ignored = True
    else:
        raise HTTPException(status_code=400, detail="Acción no válida")
        
    session.add(expense)
    session.commit()
    session.refresh(expense)
    return expense