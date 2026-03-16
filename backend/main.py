"""
Antigravity AutoML Platform — Backend Server
FastAPI application with SQLite database, JWT auth, and OpenAI integration.
"""
import os
from contextlib import asynccontextmanager
from sqlalchemy import text
from sqlalchemy.orm import Session
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base, get_db
from routers import auth, projects, ai


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Create database tables on startup (if possible)."""
    try:
        # Ensures tables exist even if the serverless cold start misses the top-level call
        Base.metadata.create_all(bind=engine)
        print("📊 Database tables checked in lifespan")
    except Exception as e:
        print(f"❌ Database lifespan error: {e}")
    yield


# Ensure tables are created at module load for serverless environments
try:
    Base.metadata.create_all(bind=engine)
    print("✨ Database tables initialized at module level")
except Exception as e:
    print(f"⚠️ Database module-level init warning: {e}")



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
def health_check(db: Session = Depends(get_db)):
    db_ok = False
    error = None
    try:
        # Simple query to test DB
        db.execute(text("SELECT 1"))
        db_ok = True
    except Exception as e:
        error = str(e)
    
    return {
        "status": "healthy" if db_ok else "degraded",
        "database": "connected" if db_ok else "failed",
        "database_error": error,
        "environment": os.getenv("VERCEL_ENV", "local")
    }
