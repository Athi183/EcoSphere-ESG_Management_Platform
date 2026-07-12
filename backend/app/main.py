from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.routers import auth, departments, categories, emission_factors, carbon_transactions, dashboard, ai, policies
from app.database.database import engine, Base
import app.models  # Import models to ensure they are registered

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(departments.router)
app.include_router(categories.router)
app.include_router(emission_factors.router)
app.include_router(carbon_transactions.router)
app.include_router(dashboard.router)
app.include_router(ai.router)
app.include_router(policies.router)

@app.get("/health")
def health_check():
    return {"status": "ok", "project": settings.PROJECT_NAME, "version": settings.VERSION}
