from sqlmodel import SQLModel
from typing import Optional # 👈 No olvides importar esto

# Lo que enviamos para crear una deuda
class DebtCreate(SQLModel):
    name: str
    total_amount: float     # El préstamo original
    current_balance: float  # Lo que debes hoy
    interest_rate: float    # Tasa de interés anual (APR)
    min_payment: float      # Pago mínimo mensual
    color: str = "bg-red-500" # Para que se vea bonito en el frontend
    user_id: Optional[int] = None # 👈 CAMBIO: Ahora es opcional para que el Backend lo asigne

# Lo que recibimos de vuelta (Aquí sí confirmamos que tiene ID y USER_ID)
class DebtRead(DebtCreate):
    id: int
    user_id: int # En la respuesta siempre devolvemos a quién pertenece
# Lo que recibimos de vuelta
class DebtRead(DebtCreate):
    id: int