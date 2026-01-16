from sqlmodel import SQLModel
from datetime import datetime
from typing import Optional # 👈 Importante

class TransactionCreate(SQLModel):
    amount: float
    type: str
    category: str
    description: str
    date: datetime = datetime.now()
    user_id: Optional[int] = None # 👈 CAMBIO: Ahora es opcional

class TransactionRead(TransactionCreate):
    id: int
    user_id: int # En la lectura sí queremos verlo siempre

# Esto es lo que le respondemos al usuario (incluye el ID)
class TransactionRead(TransactionCreate):
    id: int