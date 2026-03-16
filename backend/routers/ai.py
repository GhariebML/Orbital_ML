from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from models import User, Project, AnalysisResult, AIInsight
from schemas import AIAnalyzeRequest, AIChatRequest, AIInsightResponse
from auth import get_current_user
from services.ai_service import generate_analysis, chat_about_data

router = APIRouter(prefix="/api/v1/ai", tags=["AI Analysis"])


def _get_project_summary(project_id: int, db: Session) -> dict:
    """Aggregate all EDA results for a project into a single summary dict."""
    results = db.query(AnalysisResult).filter(AnalysisResult.project_id == project_id).all()
    summary = {}
    for r in results:
        summary[r.analysis_type] = r.result_json
    return summary


@router.post("/analyze")
def analyze_dataset(
    payload: AIAnalyzeRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Generate AI-powered analysis of a project's dataset."""
    project = db.query(Project).filter(Project.id == payload.project_id, Project.user_id == user.id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    if project.status not in ("analyzed", "deployed"):
        raise HTTPException(status_code=400, detail="Upload and analyze a dataset first")

    summary = _get_project_summary(project.id, db)
    result = generate_analysis(summary, payload.question)

    # Store the insight
    insight = AIInsight(
        project_id=project.id,
        prompt_used=payload.question or "Full dataset analysis",
        insight_text=str(result),
        model_used="gpt-4o-mini",
    )
    db.add(insight)
    db.commit()

    return result


@router.post("/chat")
def chat_with_data(
    payload: AIChatRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Interactive chat about a project's data."""
    project = db.query(Project).filter(Project.id == payload.project_id, Project.user_id == user.id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    summary = _get_project_summary(project.id, db)
    response_text = chat_about_data(summary, payload.message)

    return {"response": response_text}


@router.get("/insights/{project_id}", response_model=List[AIInsightResponse])
def get_insights(
    project_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Retrieve all stored AI insights for a project."""
    project = db.query(Project).filter(Project.id == project_id, Project.user_id == user.id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    insights = db.query(AIInsight).filter(AIInsight.project_id == project_id).order_by(AIInsight.created_at.desc()).all()
    return insights
