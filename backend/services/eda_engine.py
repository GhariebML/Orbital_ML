"""
Antigravity EDA Engine
Performs automated exploratory data analysis on uploaded CSV datasets.
Returns structured JSON compatible with the React frontend components.
"""
import pandas as pd
import numpy as np
from typing import Any


def run_full_eda(file_path: str) -> dict[str, Any]:
    """Run comprehensive EDA on a CSV file and return structured results."""
    df = pd.read_csv(file_path)

    results = {
        "overview": _compute_overview(df),
        "missing_values": _compute_missing(df),
        "duplicates": _compute_duplicates(df),
        "descriptive_stats": _compute_descriptive(df),
        "outliers_iqr": _compute_outliers(df),
        "correlations": _compute_correlations(df),
        "distributions": _compute_distributions(df),
        "class_distribution": _compute_class_distribution(df),
    }
    return results


def _compute_overview(df: pd.DataFrame) -> dict:
    return {
        "rows": int(df.shape[0]),
        "columns": int(df.shape[1]),
        "column_names": list(df.columns),
        "dtypes": {col: str(dtype) for col, dtype in df.dtypes.items()},
        "memory_mb": round(df.memory_usage(deep=True).sum() / 1024 / 1024, 2),
    }


def _compute_missing(df: pd.DataFrame) -> dict:
    missing = df.isnull().sum()
    pct = (missing / len(df) * 100).round(2)
    per_column = [
        {"column": col, "count": int(missing[col]), "percent": float(pct[col])}
        for col in df.columns
    ]
    return {"total": int(missing.sum()), "per_column": per_column}


def _compute_duplicates(df: pd.DataFrame) -> dict:
    n_dup = int(df.duplicated().sum())
    return {"count": n_dup, "percent": round(n_dup / len(df) * 100, 2)}


def _compute_descriptive(df: pd.DataFrame) -> list:
    numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
    stats = []
    for col in numeric_cols:
        series = df[col].dropna()
        stats.append({
            "feature": col,
            "mean": round(float(series.mean()), 2),
            "median": round(float(series.median()), 2),
            "std": round(float(series.std()), 2),
            "min": round(float(series.min()), 2),
            "max": round(float(series.max()), 2),
            "skew": round(float(series.skew()), 2),
        })
    return stats


def _compute_outliers(df: pd.DataFrame) -> list:
    numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
    outliers = []
    for col in numeric_cols:
        series = df[col].dropna()
        Q1 = float(series.quantile(0.25))
        Q3 = float(series.quantile(0.75))
        IQR = Q3 - Q1
        lower = Q1 - 1.5 * IQR
        upper = Q3 + 1.5 * IQR
        n_out = int(((series < lower) | (series > upper)).sum())
        outliers.append({
            "feature": col,
            "outliers": n_out,
            "percent": round(n_out / len(series) * 100, 2),
            "lower": round(lower, 2),
            "upper": round(upper, 2),
        })
    return outliers


def _compute_correlations(df: pd.DataFrame) -> dict:
    numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
    if len(numeric_cols) < 2:
        return {"matrix": [], "high_correlations": []}

    corr = df[numeric_cols].corr()

    # Find high correlations (|r| > 0.6, excluding diagonal)
    high = []
    for i in range(len(numeric_cols)):
        for j in range(i + 1, len(numeric_cols)):
            r = float(corr.iloc[i, j])
            if abs(r) > 0.6:
                high.append({
                    "feature1": numeric_cols[i],
                    "feature2": numeric_cols[j],
                    "r": round(r, 3),
                })

    # Full matrix as a serializable list
    matrix = []
    for col in numeric_cols:
        row = {"feature": col}
        for col2 in numeric_cols:
            row[col2] = round(float(corr.loc[col, col2]), 3)
        matrix.append(row)

    return {"matrix": matrix, "high_correlations": high}


def _compute_distributions(df: pd.DataFrame) -> list:
    """Compute histogram-like data for numeric columns."""
    numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
    distributions = []
    for col in numeric_cols[:10]:  # Limit to first 10 columns
        series = df[col].dropna()
        counts, bin_edges = np.histogram(series, bins=15)
        bins = [
            {"limit": round(float(bin_edges[i + 1]), 2), "count": int(counts[i])}
            for i in range(len(counts))
        ]
        distributions.append({"feature": col, "bins": bins, "skew": round(float(series.skew()), 2)})
    return distributions


def _compute_class_distribution(df: pd.DataFrame) -> list:
    """Compute the value counts for the first categorical/object column (likely the target)."""
    cat_cols = df.select_dtypes(include=["object", "category"]).columns.tolist()
    if not cat_cols:
        return []

    # Try 'class' column first, then last categorical column
    target_col = "class" if "class" in cat_cols else cat_cols[-1]
    counts = df[target_col].value_counts()

    colors = ["#534AB7", "#1D9E75", "#EF9F27", "#D85A30", "#378ADD", "#D4537E", "#6366F1", "#22D3EE"]
    result = []
    for i, (name, count) in enumerate(counts.items()):
        result.append({
            "name": str(name),
            "value": int(count),
            "color": colors[i % len(colors)],
        })
    return result
