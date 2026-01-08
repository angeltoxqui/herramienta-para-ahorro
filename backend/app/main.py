from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import SQLModel

from app.core.config import settings
from app.db.session import engine

# Importamos todos los modelos para asegurarnos de que se creen las tablas
from app.models.base import User, SavingGoal, Debt, BudgetCategory, Transaction

# --- IMPORTAMOS LAS RUTAS (ROUTERS) ---
from app.api.transactions import router as transactions_router
from app.api.users import router as users_router
from app.api.auth import router as auth_router
from app.api.budget import router as budget_router # 👈 El nuevo de presupuesto

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

# --- CONFIGURACIÓN DE CORS (Para conectar con React) ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], # Permite que tu Frontend hable con el Backend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- REGISTRAMOS TODAS LAS RUTAS ---
app.include_router(transactions_router, prefix="/transactions", tags=["Transacciones"])
app.include_router(users_router, prefix="/users", tags=["Usuarios"])
app.include_router(auth_router, prefix="/auth", tags=["Autenticación"])
app.include_router(budget_router, prefix="/budget", tags=["Presupuesto"]) # 👈 Activamos la ruta

@app.get("/")
def root():
    return {"message": "¡Hola! La API de Finanzas está corriendo y conectada a la DB 🚀"}