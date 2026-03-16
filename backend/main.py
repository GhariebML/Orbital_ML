"""
Antigravity AutoML Platform — Backend Server
FastAPI application with SQLite database, JWT auth, and OpenAI integration.
"""
import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from database import engine, Base
from routers import auth, projects, ai


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Create database tables on startup."""
    try:
        Base.metadata.create_all(bind=engine)
        print("📊 Database tables maintained")
    except Exception as e:
        print(f"❌ Database initialization error: {e}")
    
    # Create uploads directory (safe for ephemeral disk)
    os.makedirs(os.path.join(os.path.dirname(__file__), "uploads"), exist_ok=True)
    yield


app = FastAPI(
    title="Antigravity AutoML API",
    description="Professional AutoML platform with AI-powered data analysis",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS 
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # More permissive for the live deployment origin handling
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount routers
app.include_router(auth.router)
app.include_router(projects.router)
app.include_router(ai.router)


@app.get("/")
def root():
    return {
        "name": "Antigravity AutoML API",
        "version": "1.0.0",
        "status": "operational",
        "docs": "/docs",
    }


@app.get("/api/v1/health")
def health_check():
    return {"status": "healthy"}
