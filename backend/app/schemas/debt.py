from sqlmodel import SQLModel

# Lo que enviamos para crear una deuda
class DebtCreate(SQLModel):
    name: str
    total_amount: float     # El préstamo original
    current_balance: float  # Lo que debes hoy
    interest_rate: float    # Tasa de interés anual (APR)
    min_payment: float      # Pago mínimo mensual
    color: str = "bg-red-500" # Para que se vea bonito en el frontend
    user_id: int            # Temporalmente manual

# Lo que recibimos de vuelta
class DebtRead(DebtCreate):
    id: int