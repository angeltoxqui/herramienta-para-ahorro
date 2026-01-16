from sqlmodel import SQLModel
from typing import Optional
from datetime import date

# Lo que enviamos para crear una meta
class SavingCreate(SQLModel):
    name: str
    target_amount: float     # La meta (ej: 5000)
    current_amount: float    # Lo que tienes ahorrado hoy (ej: 500)
    deadline: Optional[date] = None 
    type: str = "free"       
    image_url: Optional[str] = None 
    user_id: int             

# Lo que recibimos de vuelta
class SavingRead(SavingCreate):
    id: int