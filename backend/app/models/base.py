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

# 2. TABLA DE METAS DE AHORRO
class SavingGoal(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    name: str
    target_amount: float
    current_amount: float = 0.0
    deadline: Optional[date] = None
    type: str = "free"
    image_url: Optional[str] = None

# 3. TABLA DE DEUDAS
class Debt(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    name: str
    total_amount: float
    current_balance: float # Lo que falta por pagar
    interest_rate: float # APR Anual
    min_payment: float
    color: str = "bg-blue-500"

# 4. TABLA DE CATEGORÍAS DE PRESUPUESTO (MODIFICADA 🟢)
class BudgetCategory(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    name: str
    limit_amount: float
    spent_amount: float = 0.0
    
    # 🟢 Nuevo campo para el Rollover (Sobrante del mes anterior)
    rollover_amount: float = Field(default=0.0) 
    
    icon: str = "🏷️"
    eco_score: str = "low"

# 5. TABLA DE TRANSACCIONES
class Transaction(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    debt_id: Optional[int] = Field(default=None, foreign_key="debt.id")
    amount: float
    type: str # income, expense
    category: str
    description: str
    date: datetime = Field(default_factory=datetime.utcnow)

# --- TABLAS DEL DIFERENCIADOR ---
class RecurringExpense(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    name: str
    amount: float
    frequency: str
    detected_day: int
    confidence_score: float = 0.0
    is_confirmed: bool = False
    is_ignored: bool = False
    last_charged_date: Optional[date] = None

class FamilyGroup(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    owner_id: int = Field(foreign_key="user.id")
    invite_code: str = Field(unique=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)