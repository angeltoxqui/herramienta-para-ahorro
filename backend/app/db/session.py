from sqlmodel import create_engine, Session
from app.core.config import settings

# Supabase requiere SSL mode 'require' para conexiones seguras
# Y a veces el string empieza con postgres:// pero Python necesita postgresql://
connection_string = settings.DATABASE_URL.replace("postgres://", "postgresql://")

engine = create_engine(
    connection_string, 
    echo=True, # Esto imprimirá las consultas SQL en la consola (útil para depurar)
    connect_args={"check_same_thread": False} if "sqlite" in connection_string else {} 
)

def get_session():
    with Session(engine) as session:
        yield session