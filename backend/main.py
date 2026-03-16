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
    Base.metadata.create_all(bind=engine)
    # Create uploads directory
    os.makedirs(os.path.join(os.path.dirname(__file__), "uploads"), exist_ok=True)
    print("✨ Antigravity Backend Ready")
    print("📊 Database tables created")
    print("🔗 API docs at http://localhost:8000/docs")
    yield


app = FastAPI(
    title="Antigravity AutoML API",
    description="Professional AutoML platform with AI-powered data analysis",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS — Allow the Vite dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
    ],
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
