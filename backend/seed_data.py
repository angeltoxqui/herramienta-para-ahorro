import httpx
import asyncio
from datetime import datetime, timedelta
import random

# CONFIGURACIÓN
BASE_URL = "http://127.0.0.1:8000"
EMAIL = f"tester_{random.randint(1000,9999)}@test.com" # Email aleatorio para no chocar
PASSWORD = "password123"

async def main():
    async with httpx.AsyncClient() as client:
        print(f"🚀 Iniciando prueba para usuario: {EMAIL}")

        # 1. CREAR USUARIO
        print("1️⃣  Registrando usuario...")
        resp = await client.post(f"{BASE_URL}/users/", json={
            "email": EMAIL,
            "password": PASSWORD,
            "full_name": "Tester IA"
        })
        if resp.status_code != 200:
            print(f"❌ Error creando usuario: {resp.text}")
            return
        
        # 2. INICIAR SESIÓN (Obtener Token)
        print("2️⃣  Iniciando sesión...")
        resp = await client.post(f"{BASE_URL}/auth/login", data={
            "username": EMAIL,
            "password": PASSWORD
        })
        token = resp.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        print("✅ Token obtenido con éxito.")

        # 3. INYECTAR DATOS SIMULADOS (Pasado)
        print("3️⃣  Inyectando historial de 3 meses...")
        
        # Patrón 1: Netflix (Detectado) - Mismo día, mismo monto
        today = datetime.now()
        dates = [
            today - timedelta(days=90), # Hace 3 meses
            today - timedelta(days=60), # Hace 2 meses
            today - timedelta(days=30)  # Hace 1 mes
        ]

        for date_obj in dates:
            # Transacción Recurrente (Netflix)
            await client.post(f"{BASE_URL}/transactions/", json={
                "amount": 15.99,
                "type": "expense",
                "category": "Entretenimiento",
                "description": "Netflix Premium",
                "date": date_obj.isoformat()
            }, headers=headers)

            # Transacción Recurrente (Spotify)
            await client.post(f"{BASE_URL}/transactions/", json={
                "amount": 9.99,
                "type": "expense",
                "category": "Entretenimiento",
                "description": "Spotify Individual",
                "date": (date_obj + timedelta(days=2)).isoformat() # Unos días después
            }, headers=headers)
            
            # Ruido (Gastos random para confundir)
            for _ in range(2):
                await client.post(f"{BASE_URL}/transactions/", json={
                    "amount": random.uniform(5, 50),
                    "type": "expense",
                    "category": "Comida",
                    "description": random.choice(["Oxxo", "Uber", "Tacos"]),
                    "date": (date_obj + timedelta(days=random.randint(1, 10))).isoformat()
                }, headers=headers)

        print("✅ Transacciones insertadas correctamente.")

        # 4. PROBAR EL CEREBRO (El momento de la verdad)
        print("\n🧠 4️⃣  Ejecutando ANÁLISIS DE IA...")
        resp = await client.post(f"{BASE_URL}/analysis/scan-recurring", headers=headers)
        
        if resp.status_code == 200:
            detectados = resp.json()
            print(f"\n🎉 ¡RESULTADO EXITOSO! Se detectaron {len(detectados)} patrones:")
            print("="*60)
            for item in detectados:
                print(f"🕵️  Nombre: {item['name']}")
                print(f"💰 Monto: ${item['amount']}")
                print(f"📅 Día detectado: {item['detected_day']}")
                print(f"🤖 Confianza: {item['confidence_score'] * 100}%")
                print("-" * 60)
        else:
            print(f"❌ Error en el análisis: {resp.text}")

if __name__ == "__main__":
    asyncio.run(main())