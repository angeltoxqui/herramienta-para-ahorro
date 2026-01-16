from typing import Optional
from sqlmodel import Field, SQLModel
from datetime import datetime, date

# 1. TABLA DE USUARIOS
class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(unique=True, index=True)
    password_hash: str
    full_name: str
    is_premium: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)

# 2. TABLA DE METAS DE AHORRO (Savings)
class SavingGoal(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    name: str
    target_amount: float
    current_amount: float = 0.0
    deadline: Optional[date] = None
    type: str = "free" # free, template, shared
    image_url: Optional[str] = None

# 3. TABLA DE DEUDAS (Debts)
class Debt(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    name: str
    total_amount: float
    current_balance: float # Lo que falta por pagar
    interest_rate: float # APR
    min_payment: float
    color: str = "bg-blue-500" # Para el frontend

# 4. TABLA DE CATEGORÍAS DE PRESUPUESTO
class BudgetCategory(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    name: str
    limit_amount: float
    spent_amount: float = 0.0
    icon: str = "🏷️"
    eco_score: str = "low" # low, med, high

# 5. TABLA DE TRANSACCIONES (Dashboard)
class Transaction(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    amount: float
    type: str # income, expense
    category: str
    description: str
    date: datetime = Field(default_factory=datetime.utcnow)

# --- NUEVAS TABLAS PARA EL DIFERENCIADOR 2026 ---

# 6. TABLA DE GASTOS RECURRENTES DETECTADOS (El "Gastos Silenciosos")
class RecurringExpense(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    
    name: str             # Ej: "Netflix"
    amount: float         # Ej: 15.99
    frequency: str        # "monthly", "weekly", "yearly"
    
    # Datos para la IA/Algoritmo
    detected_day: int     # Ej: día 15 de cada mes
    confidence_score: float = 0.0 # Qué tan seguro está el sistema (0.0 a 1.0)
    
    is_confirmed: bool = False    # ¿El usuario confirmó que es real?
    is_ignored: bool = False      # ¿El usuario dijo "ignora esto"?
    
    last_charged_date: Optional[date] = None

# 7. TABLA DE GRUPOS FAMILIARES (Para Finanzas Colaborativas)
class FamilyGroup(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    owner_id: int = Field(foreign_key="user.id")
    invite_code: str = Field(unique=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)