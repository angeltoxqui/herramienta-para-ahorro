from sqlmodel import SQLModel

# Lo que recibimos del cliente
class UserCreate(SQLModel):
    email: str
    password: str
    full_name: str

# Lo que devolvemos (sin la contraseña por seguridad)
class UserRead(SQLModel):
    id: int
    email: str
    full_name: str
    is_premium: bool