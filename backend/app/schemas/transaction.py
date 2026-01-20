from sqlmodel import SQLModel
from datetime import datetime
from typing import Optional

class TransactionBase(SQLModel):
    amount: float
    type: str
    category: str
    description: str
    date: Optional[datetime] = None
    debt_id: Optional[int] = None # 👈 Nuevo campo opcional

class TransactionCreate(TransactionBase):
    pass

class TransactionRead(TransactionBase):
    id: int
    user_id: int