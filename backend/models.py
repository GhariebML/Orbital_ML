import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, Float, ForeignKey, JSON
from sqlalchemy.orm import relationship
from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    name = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    projects = relationship("Project", back_populates="owner")


class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text, default="")
    dataset_filename = Column(String(255), default=None)
    dataset_rows = Column(Integer, default=0)
    dataset_columns = Column(Integer, default=0)
    status = Column(String(50), default="created")  # created | uploaded | analyzed | deployed
    user_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    owner = relationship("User", back_populates="projects")
    analysis_results = relationship("AnalysisResult", back_populates="project")
    ai_insights = relationship("AIInsight", back_populates="project")
    model_results = relationship("ModelResult", back_populates="project")


class AnalysisResult(Base):
    __tablename__ = "analysis_results"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"))
    analysis_type = Column(String(100))  # eda_overview | missing_values | outliers | correlations | distributions
    result_json = Column(JSON, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    project = relationship("Project", back_populates="analysis_results")


class AIInsight(Base):
    __tablename__ = "ai_insights"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"))
    prompt_used = Column(Text)
    insight_text = Column(Text)
    model_used = Column(String(100), default="gpt-4o-mini")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    project = relationship("Project", back_populates="ai_insights")


class ModelResult(Base):
    __tablename__ = "model_results"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"))
    name = Column(String(100), nullable=False)
    accuracy = Column(Float, nullable=False)
    f1 = Column(Float, nullable=False)
    roc_auc = Column(Float, nullable=False)
    is_best_model = Column(Integer, default=0) # 1 if best, 0 otherwise
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    project = relationship("Project", back_populates="model_results")
