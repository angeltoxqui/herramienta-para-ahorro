from sqlmodel import SQLModel
from datetime import datetime

# Esto es lo que el usuario nos manda para CREAR
class TransactionCreate(SQLModel):
    amount: float
    type: str  # income o expense
    category: str
    description: str
    date: datetime = datetime.now()
    user_id: int  # Por ahora lo mandamos manual, luego será automático con el login

# Esto es lo que le respondemos al usuario (incluye el ID)
class TransactionRead(TransactionCreate):
    id: int