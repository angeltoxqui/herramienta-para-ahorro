from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import SQLModel

from app.core.config import settings
from app.db.session import engine

# Importamos modelos
from app.models.base import User, SavingGoal, Debt, BudgetCategory, Transaction

# Importamos rutas
from app.api.transactions import router as transactions_router
from app.api.users import router as users_router
from app.api.auth import router as auth_router
from app.api.budget import router as budget_router
from app.api.debts import router as debts_router
from app.api.savings import router as savings_router # 👈 NUEVO
from app.api.analysis import router as analysis_router # 👈 NUEVO

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("🔄 Creando tablas en la base de datos...")
    SQLModel.metadata.create_all(engine)
    print("✅ Tablas creadas (o verificadas) exitosamente")
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registramos las rutas
app.include_router(transactions_router, prefix="/transactions", tags=["Transacciones"])
app.include_router(users_router, prefix="/users", tags=["Usuarios"])
app.include_router(auth_router, prefix="/auth", tags=["Autenticación"])
app.include_router(budget_router, prefix="/budget", tags=["Presupuesto"])
app.include_router(debts_router, prefix="/debts", tags=["Deudas"])
app.include_router(savings_router, prefix="/savings", tags=["Ahorros"]) # 👈 REGISTRADO
app.include_router(analysis_router, prefix="/analysis", tags=["Inteligencia Artificial 🧠"])

@app.get("/")
def root():
    return {"message": "¡Hola! La API de Finanzas está corriendo y conectada a la DB 🚀"}