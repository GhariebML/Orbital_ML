"""
Antigravity AI Service
Integrates with OpenAI to provide intelligent data analysis and insights.
"""
import os
import json
from openai import OpenAI
from deepagents import create_deep_agent
from langchain_core.tools import tool
from langchain_openai import ChatOpenAI

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")

client = OpenAI(api_key=OPENAI_API_KEY) if OPENAI_API_KEY else None

# Initialize an LLM for the deep agent
llm = ChatOpenAI(model="gpt-4o-mini", api_key=OPENAI_API_KEY) if OPENAI_API_KEY else None

SYSTEM_PROMPT = """You are Antigravity AI — a senior data scientist embedded in an AutoML platform.
You analyze datasets and provide executive-level insights. Your responses should be:
1. Professional and concise
2. Structured with clear sections
3. Actionable with specific recommendations
4. Include statistical reasoning

Format your response as JSON with these fields:
{
  "summary": "A 2-3 sentence executive summary",
  "insights": [
    {"title": "Insight Title", "description": "Detailed explanation", "type": "success|warning|info|error", "priority": "high|medium|low"}
  ],
  "recommendations": ["Recommendation 1", "Recommendation 2"],
  "risk_factors": ["Risk 1", "Risk 2"]
}
"""

CHAT_SYSTEM_PROMPT = """You are Antigravity AI — a senior data scientist helping users understand their data.
You have access to the dataset's statistical profile. Answer questions clearly and professionally, utilizing the `query_dataset_stats` tool if you need to know specific metrics or properties about the dataset. 
Use specific numbers from the data when possible. Be concise but thorough."""


def generate_analysis(dataset_summary: dict, question: str = None) -> dict:
    """Generate AI-powered analysis of a dataset using OpenAI."""
    if not client:
        return _fallback_analysis(dataset_summary)

    user_message = f"""Analyze this dataset and provide professional insights:

Dataset Overview:
- Rows: {dataset_summary.get('overview', {}).get('rows', 'N/A')}
- Columns: {dataset_summary.get('overview', {}).get('columns', 'N/A')}

Descriptive Statistics:
{json.dumps(dataset_summary.get('descriptive_stats', [])[:6], indent=2)}

Outlier Summary:
{json.dumps(dataset_summary.get('outliers_iqr', [])[:6], indent=2)}

High Correlations:
{json.dumps(dataset_summary.get('correlations', {}).get('high_correlations', []), indent=2)}

Class Distribution:
{json.dumps(dataset_summary.get('class_distribution', []), indent=2)}
"""
    if question:
        user_message += f"\n\nUser Question: {question}"

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_message},
            ],
            temperature=0.3,
            max_tokens=2000,
            response_format={"type": "json_object"},
        )
        content = response.choices[0].message.content
        return json.loads(content)
    except Exception as e:
        print(f"OpenAI API error: {e}")
        return _fallback_analysis(dataset_summary)


def chat_about_data(dataset_summary: dict, message: str, history: list = None) -> str:
    """Interactive chat about the dataset using deepagents."""
    if not llm:
        return _fallback_chat(message)

    @tool
    def query_dataset_stats(query: str) -> str:
        """Query the overall dataset statistics, looking for anything matching the string query."""
        res = []
        q_lower = query.lower()
        
        # Check overview
        for k, v in dataset_summary.get("overview", {}).items():
            if q_lower in k.lower() or q_lower in str(v).lower():
                res.append(f"Overview '{k}': {v}")
                
        # Check feature stats
        for stat in dataset_summary.get("descriptive_stats", []):
            if q_lower in stat.get("feature", "").lower():
                res.append(f"Stat for {stat.get('feature')}: {stat}")
                
        # Check correlations
        for c in dataset_summary.get("correlations", {}).get("high_correlations", []):
            if q_lower in c.get("feature1", "").lower() or q_lower in c.get("feature2", "").lower():
                res.append(f"Correlation: {c}")
                
        # Check outliers
        for out in dataset_summary.get("outliers_iqr", []):
            if q_lower in out.get("feature", "").lower():
                res.append(f"Outlier: {out}")
                
        if not res:
            return "No matching stats found in the dataset summary."
            
        return "\n".join(res)

    agent = create_deep_agent(
        model=llm,
        tools=[query_dataset_stats],
        system_prompt=CHAT_SYSTEM_PROMPT
    )

    messages = []
    if history:
        messages.extend(history[-6:])  # Keep last 6 messages
    messages.append({"role": "user", "content": message})

    try:
        result = agent.invoke({"messages": messages})
        return result["messages"][-1].content
    except Exception as e:
        print(f"DeepAgent error: {e}")
        return _fallback_chat(message)


def _fallback_analysis(summary: dict) -> dict:
    """Fallback analysis when OpenAI is not configured."""
    stats = summary.get("descriptive_stats", [])
    outliers = summary.get("outliers_iqr", [])
    high_corr = summary.get("correlations", {}).get("high_correlations", [])
    rows = summary.get("overview", {}).get("rows", 0)
    cols = summary.get("overview", {}).get("columns", 0)

    insights = []

    # Generate insights from outliers
    high_outlier_features = [o for o in outliers if o.get("percent", 0) > 3]
    if high_outlier_features:
        names = ", ".join([o["feature"] for o in high_outlier_features[:3]])
        insights.append({
            "title": "Significant Outliers Detected",
            "description": f"Features {names} contain >3% outliers. Consider capping or applying robust scaling before modeling.",
            "type": "warning",
            "priority": "high"
        })

    # Generate insights from correlations
    if high_corr:
        pair = high_corr[0]
        insights.append({
            "title": "Multicollinearity Warning",
            "description": f"{pair['feature1']} and {pair['feature2']} show strong correlation (r={pair['r']}). Consider PCA or dropping one feature.",
            "type": "error",
            "priority": "high"
        })

    # Generate insights from skewness
    skewed = [s for s in stats if abs(s.get("skew", 0)) > 1]
    if skewed:
        names = ", ".join([s["feature"] for s in skewed[:3]])
        insights.append({
            "title": "Highly Skewed Features",
            "description": f"Features {names} have |skew| > 1. A log or Box-Cox transformation is recommended.",
            "type": "info",
            "priority": "medium"
        })

    insights.append({
        "title": "Dataset Scale",
        "description": f"Dataset contains {rows:,} records across {cols} features. This is sufficient for most ML algorithms without augmentation.",
        "type": "success",
        "priority": "low"
    })

    return {
        "summary": f"Analysis of {rows:,} records across {cols} features completed. {len(insights)} actionable insights identified.",
        "insights": insights,
        "recommendations": [
            "Apply StandardScaler to all numeric features before training.",
            "Use 5-fold stratified cross-validation for robust evaluation.",
            "Consider ensemble methods (XGBoost, LightGBM) as baseline models.",
        ],
        "risk_factors": [
            f"{'High' if high_outlier_features else 'Low'} outlier impact on model performance.",
            f"{'Multicollinearity detected' if high_corr else 'No significant multicollinearity'}.",
        ]
    }


def _fallback_chat(message: str) -> str:
    return ("I'm the Antigravity AI assistant. To enable full AI-powered analysis, "
            "please set the `OPENAI_API_KEY` environment variable. "
            "In the meantime, I can provide rule-based insights from the EDA engine.")
