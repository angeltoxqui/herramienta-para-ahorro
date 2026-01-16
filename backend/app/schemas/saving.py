from sqlmodel import SQLModel
from typing import Optional
from datetime import date

class SavingCreate(SQLModel):
    name: str
    target_amount: float
    current_amount: float
    deadline: Optional[date] = None 
    type: str = "free"       
    image_url: Optional[str] = None 
    user_id: Optional[int] = None # 👈 CAMBIO: Opcional

class SavingRead(SavingCreate):
    id: int
    user_id: int        

# Lo que recibimos de vuelta
class SavingRead(SavingCreate):
    id: int