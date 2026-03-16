import os
import shutil
from fastapi import APIRouter, HTTPException, Depends, UploadFile, File
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from models import User, Project, AnalysisResult
import schemas
from schemas import ProjectCreate, ProjectResponse, AnalysisResultResponse
from auth import get_current_user
from services.eda_engine import run_full_eda

router = APIRouter(prefix="/api/v1/projects", tags=["Projects"])

UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.get("/", response_model=List[ProjectResponse])
def list_projects(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    """List all projects for the authenticated user."""
    projects = db.query(Project).filter(Project.user_id == user.id).order_by(Project.created_at.desc()).all()
    return projects


@router.post("/", response_model=ProjectResponse)
def create_project(payload: ProjectCreate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    """Create a new project."""
    project = Project(
        name=payload.name,
        description=payload.description or "",
        user_id=user.id,
    )
    db.add(project)
    db.commit()
    db.refresh(project)
    return project


@router.get("/{project_id}", response_model=ProjectResponse)
def get_project(project_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    """Get a specific project by ID."""
    project = db.query(Project).filter(Project.id == project_id, Project.user_id == user.id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project


@router.post("/{project_id}/upload", response_model=ProjectResponse)
def upload_dataset(
    project_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Upload a CSV dataset to a project and automatically run EDA."""
    project = db.query(Project).filter(Project.id == project_id, Project.user_id == user.id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    if not file.filename.endswith((".csv", ".xlsx")):
        raise HTTPException(status_code=400, detail="Only CSV and Excel files are supported")

    # Save file to disk
    file_path = os.path.join(UPLOAD_DIR, f"project_{project_id}_{file.filename}")
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Run the EDA engine
    try:
        eda_results = run_full_eda(file_path)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"EDA failed: {str(e)}")

    # Update project metadata
    overview = eda_results.get("overview", {})
    project.dataset_filename = file.filename
    project.dataset_rows = overview.get("rows", 0)
    project.dataset_columns = overview.get("columns", 0)
    project.status = "analyzed"

    # Store each EDA section as a separate analysis result
    for analysis_type, result_data in eda_results.items():
        analysis = AnalysisResult(
            project_id=project.id,
            analysis_type=analysis_type,
            result_json=result_data,
        )
        db.add(analysis)

    db.commit()
    db.refresh(project)
    return project


@router.get("/{project_id}/analysis", response_model=List[AnalysisResultResponse])
def get_analysis(project_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    """Get all EDA analysis results for a project."""
    project = db.query(Project).filter(Project.id == project_id, Project.user_id == user.id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    results = db.query(AnalysisResult).filter(AnalysisResult.project_id == project_id).all()
    return results


@router.delete("/{project_id}")
def delete_project(project_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    """Delete a specific project and all its related records."""
    project = db.query(Project).filter(Project.id == project_id, Project.user_id == user.id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    # The DB relationships are configured with back_populates but not cascade deletes in models.
    # We should delete related AnalysisResult and AIInsight records first to avoid foreign key constraints.
    import models
    db.query(models.AnalysisResult).filter(models.AnalysisResult.project_id == project_id).delete()
    db.query(models.AIInsight).filter(models.AIInsight.project_id == project_id).delete()
    
    # Delete the uploaded file if it exists
    if project.dataset_filename:
        file_path = os.path.join(UPLOAD_DIR, f"project_{project_id}_{project.dataset_filename}")
        if os.path.exists(file_path):
            os.remove(file_path)

    # Finally delete the project
    db.delete(project)
    db.commit()
    return {"message": "Project deleted successfully"}


@router.post("/{project_id}/train", response_model=List[schemas.ModelResultResponse])
def train_project_models(
    project_id: int, 
    payload: dict, # expects {"target_column": "Churn"}
    db: Session = Depends(get_db), 
    user: User = Depends(get_current_user)
):
    """Trigger the AutoML training pipeline on the project's dataset."""
    project = db.query(Project).filter(Project.id == project_id, Project.user_id == user.id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    target_col = payload.get("target_column")
    if not target_col:
        raise HTTPException(status_code=400, detail="target_column is required in payload")

    if not project.dataset_filename:
        raise HTTPException(status_code=400, detail="Project has no dataset uploaded")

    file_path = os.path.join(UPLOAD_DIR, f"project_{project_id}_{project.dataset_filename}")
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Dataset file missing from disk")

    from services.ml_engine import train_models
    import models

    try:
        results_data = train_models(file_path, target_col, project_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Training failed: {str(e)}")

    # Clear old model results if any
    db.query(models.ModelResult).filter(models.ModelResult.project_id == project_id).delete()

    # Save new models
    stored_results = []
    for r in results_data:
        mr = models.ModelResult(
            project_id=project_id,
            name=r["name"],
            accuracy=r["accuracy"],
            f1=r["f1"],
            roc_auc=r["roc_auc"],
            is_best_model=r["is_best_model"]
        )
        db.add(mr)
        stored_results.append(mr)

    # Update project status
    project.status = "deployed"
    
    db.commit()
    return stored_results


@router.get("/{project_id}/models", response_model=List[schemas.ModelResultResponse])
def get_project_models(project_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    """Fetch all model results for a specific project."""
    import models
    project = db.query(Project).filter(Project.id == project_id, Project.user_id == user.id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    models_list = db.query(models.ModelResult).filter(models.ModelResult.project_id == project_id).order_by(models.ModelResult.roc_auc.desc()).all()
    return models_list


@router.get("/{project_id}/models/metadata")
def get_model_metadata(project_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    """Fetch feature columns and classes for the project's best model."""
    import joblib
    project = db.query(Project).filter(Project.id == project_id, Project.user_id == user.id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    models_dir = os.path.join(os.path.dirname(__file__), "..", "models_data")
    metadata_path = os.path.join(models_dir, f"project_{project_id}_metadata.joblib")

    if not os.path.exists(metadata_path):
        raise HTTPException(status_code=404, detail="Model metadata missing.")

    metadata = joblib.load(metadata_path)
    return {
        "feature_columns": metadata.get("feature_columns", []),
        "classes": metadata.get("classes", [])
    }


@router.post("/{project_id}/predict")
def predict_with_model(project_id: int, payload: dict, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    """Run interactive inference using the best saved model."""
    import joblib
    import time
    import pandas as pd
    
    start_time = time.time()
    
    project = db.query(Project).filter(Project.id == project_id, Project.user_id == user.id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    models_dir = os.path.join(os.path.dirname(__file__), "..", "models_data")
    model_path = os.path.join(models_dir, f"project_{project_id}_model.joblib")
    metadata_path = os.path.join(models_dir, f"project_{project_id}_metadata.joblib")

    if not os.path.exists(model_path) or not os.path.exists(metadata_path):
        raise HTTPException(status_code=400, detail="Model artifact missing. Have you trained a model yet?")

    model = joblib.load(model_path)
    metadata = joblib.load(metadata_path)

    # Reconstruct inputs
    feature_cols = metadata["feature_columns"]
    classes = metadata["classes"]
    
    # We parse payload against feature_cols
    input_df = pd.DataFrame([payload])
    
    # Fill missing cols with 0
    for col in feature_cols:
        if col not in input_df.columns:
            input_df[col] = 0.0
    
    # Reorder precisely
    input_df = input_df[feature_cols]

    try:
        if hasattr(model, "predict_proba"):
            probs = model.predict_proba(input_df)[0]
            pred_idx = probs.argmax()
            pred_class = classes[pred_idx]
            
            prob_dict = {str(classes[i]): float(probs[i]) for i in range(len(classes))}
            max_prob = float(probs[pred_idx])
        else:
            pred_idx = int(model.predict(input_df)[0])
            pred_class = classes[pred_idx] if pred_idx < len(classes) else str(pred_idx)
            max_prob = 1.0 # fallback
            prob_dict = {pred_class: 1.0}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Inference failed: {str(e)}")

    latency_ms = int((time.time() - start_time) * 1000)

    return {
        "status": "success",
        "data": {
            "prediction": str(pred_class),
            "probabilities": prob_dict,
            "probability": max_prob # simple primary confidence
        },
        "metadata": {
            "model_version": "v1.0",
            "latency": f"{latency_ms}ms"
        }
    }
