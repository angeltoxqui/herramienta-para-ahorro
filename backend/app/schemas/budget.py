from sqlmodel import SQLModel
from typing import Optional

# Lo que enviamos para crear una categoría
class CategoryCreate(SQLModel):
    name: str
    limit_amount: float
    icon: str = "🏷️"
    eco_score: str = "low" # low, med, high
    user_id: int # Temporalmente manual, luego automático

# Lo que recibimos (incluye cuánto llevamos gastado)
class CategoryRead(CategoryCreate):
    id: int
    spent_amount: float = 0.0 # Esto lo calcularemos en el futuro sumando transacciones