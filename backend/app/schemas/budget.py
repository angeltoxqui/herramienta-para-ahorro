from sqlmodel import SQLModel
from typing import Optional

class CategoryBase(SQLModel):
    name: str
    limit_amount: float
    icon: str = "🏷️"
    eco_score: str = "low"

class CategoryCreate(CategoryBase):
    pass

class CategoryRead(CategoryBase):
    id: int
    user_id: int
    spent_amount: float
    rollover_amount: float = 0.0 # 🟢 Agregado