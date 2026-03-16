import pandas as pd
import numpy as np
import os
import joblib
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from xgboost import XGBClassifier
from sklearn.metrics import accuracy_score, f1_score, roc_auc_score

def preprocess_data(df: pd.DataFrame, target_col: str):
    """
    Cleans and prepares data for ML.
    Handles missing values and encodes categorical features.
    """
    X = df.drop(columns=[target_col])
    y = df[target_col]

    # Handle missing values in X
    numeric_cols = X.select_dtypes(include=['int64', 'float64']).columns
    categorical_cols = X.select_dtypes(include=['object', 'category', 'bool']).columns

    if len(numeric_cols) > 0:
        num_imputer = SimpleImputer(strategy='median')
        X[numeric_cols] = num_imputer.fit_transform(X[numeric_cols])

    if len(categorical_cols) > 0:
        cat_imputer = SimpleImputer(strategy='most_frequent')
        X[categorical_cols] = cat_imputer.fit_transform(X[categorical_cols])

    # Convert categoricals to dummy variables
    X = pd.get_dummies(X, columns=categorical_cols, drop_first=True)

    # Encode target if categorical
    le = LabelEncoder()
    y_encoded = le.fit_transform(y)
    
    # Scale numerical features
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    return X_scaled, y_encoded, list(X.columns), le

def train_models(file_path: str, target_col: str, project_id: int):
    """
    Trains multiple models and returns their metrics.
    Saves the best model to disk.
    """
    if file_path.endswith('.csv'):
        df = pd.read_csv(file_path)
    else:
        df = pd.read_excel(file_path)

    # Validate target col
    if target_col not in df.columns:
        raise ValueError(f"Target column '{target_col}' not found in dataset.")

    # Only using ~5000 rows for quick demo performance if dataset is large
    if len(df) > 5000:
        df = df.sample(5000, random_state=42)

    X_scaled, y_encoded, feature_names, label_encoder = preprocess_data(df, target_col)
    
    # Needs at least 2 classes
    num_classes = len(np.unique(y_encoded))
    if num_classes < 2:
        raise ValueError("Target column must have at least 2 distinct classes.")

    X_train, X_test, y_train, y_test = train_test_split(X_scaled, y_encoded, test_size=0.2, random_state=42)

    # Define models
    models = {
        "Logistic Regression": LogisticRegression(max_iter=1000, random_state=42),
        "Random Forest": RandomForestClassifier(n_estimators=100, random_state=42),
        "XGBoost": XGBClassifier(use_label_encoder=False, eval_metric='logloss', random_state=42)
    }

    results = []
    best_model_name = None
    best_auc = -1
    best_model_obj = None

    for name, model in models.items():
        try:
            model.fit(X_train, y_train)
            y_pred = model.predict(X_test)
            
            # For AUC, need probabilities probabilities
            if hasattr(model, "predict_proba"):
                y_prob = model.predict_proba(X_test)
                if num_classes == 2:
                    auc = roc_auc_score(y_test, y_prob[:, 1])
                else:
                    auc = roc_auc_score(y_test, y_prob, multi_class='ovr')
            else:
                auc = 0.5 # fallback

            acc = accuracy_score(y_test, y_pred)
            f1 = f1_score(y_test, y_pred, average='weighted')

            results.append({
                "name": name,
                "accuracy": float(acc),
                "f1": float(f1),
                "roc_auc": float(auc)
            })

            # Check if best
            if auc > best_auc:
                best_auc = auc
                best_model_name = name
                best_model_obj = model
        except Exception as e:
            print(f"Error training {name}: {e}")
            continue

    # Mark best model
    for r in results:
        r["is_best_model"] = 1 if r["name"] == best_model_name else 0

    # Save best model to disk for later predictions
    if best_model_obj:
        models_dir = os.path.join(os.path.dirname(__file__), "..", "models_data")
        os.makedirs(models_dir, exist_ok=True)
        model_path = os.path.join(models_dir, f"project_{project_id}_model.joblib")
        metadata_path = os.path.join(models_dir, f"project_{project_id}_metadata.joblib")
        
        joblib.dump(best_model_obj, model_path)
        
        # Save feature columns and label classes so we can reconstruct inputs during inference
        metadata = {
            "feature_columns": feature_names,
            "classes": label_encoder.classes_.tolist()
        }
        joblib.dump(metadata, metadata_path)

    return results
