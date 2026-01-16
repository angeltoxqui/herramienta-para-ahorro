from sqlmodel import SQLModel
from typing import Optional

class CategoryCreate(SQLModel):
    name: str
    limit_amount: float
    icon: str = "🏷️"
    eco_score: str = "low"
    user_id: Optional[int] = None # 👈 CAMBIO: Opcional

class CategoryRead(CategoryCreate):
    id: int
    spent_amount: float = 0.0
    user_id: int

# Lo que recibimos (incluye cuánto llevamos gastado)
class CategoryRead(CategoryCreate):
    id: int
    spent_amount: float = 0.0 # Esto lo calcularemos en el futuro sumando transacciones