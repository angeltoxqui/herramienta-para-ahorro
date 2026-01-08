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