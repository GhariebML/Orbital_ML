import datetime
from pydantic import BaseModel, EmailStr
from typing import Optional, Any


# ── Auth Schemas ─────────────────────────────────────────────
class UserRegister(BaseModel):
    email: str
    password: str
    name: str


class UserLogin(BaseModel):
    email: str
    password: str


class UserResponse(BaseModel):
    id: int
    email: str
    name: str
    created_at: datetime.datetime

    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


# ── Project Schemas ──────────────────────────────────────────
class ProjectCreate(BaseModel):
    name: str
    description: Optional[str] = ""


class ProjectResponse(BaseModel):
    id: int
    name: str
    description: str
    dataset_filename: Optional[str]
    dataset_rows: int
    dataset_columns: int
    status: str
    created_at: datetime.datetime

    class Config:
        from_attributes = True


# ── Analysis Schemas ─────────────────────────────────────────
class AnalysisResultResponse(BaseModel):
    id: int
    project_id: int
    analysis_type: str
    result_json: Any
    created_at: datetime.datetime

    class Config:
        from_attributes = True


# ── AI Schemas ───────────────────────────────────────────────
class AIAnalyzeRequest(BaseModel):
    project_id: int
    question: Optional[str] = None


class AIChatRequest(BaseModel):
    project_id: int
    message: str


class AIInsightResponse(BaseModel):
    id: int
    project_id: int
    insight_text: str
    model_used: str
    created_at: datetime.datetime

    class Config:
        from_attributes = True

# ── Model Schemas ──────────────────────────────────────────────
class ModelResultResponse(BaseModel):
    id: int
    project_id: int
    name: str
    accuracy: float
    f1: float
    roc_auc: float
    is_best_model: int
    created_at: datetime.datetime

    class Config:
        from_attributes = True
