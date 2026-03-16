# Orbital ML

Orbital ML is a comprehensive Machine Learning and Data Analysis platform. It features a modern web interface built with React, TypeScript, and Vite, complemented by a robust Python backend for handling Machine Learning operations and Exploratory Data Analysis (EDA).

## Project Structure

- `src/`: Frontend React application with Vite.
- `backend/`: Python backend services for ML models and API endpoints.

## Prerequisites

- Node.js (v18 or higher recommended)
- Python (v3.10 or higher recommended)

## Getting Started

### Frontend Setup

1. Navigate to the project root directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

### Backend Setup

1. Navigate to the `backend` directory.
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install backend dependencies (assuming a requirements.txt or pipenv):
   ```bash
   pip install -r requirements.txt
   ```
4. Start the backend server (e.g., using FastAPI/Uvicorn or Flask):
   ```bash
   # Example command:
   uvicorn main:app --reload
   ```

## Features

- **Exploratory Data Analysis (EDA)**: Upload and analyze datasets automatically.
- **Machine Learning Pipeline**: Train, evaluate, and predict using various ML models.
- **Interactive UI**: Manage projects and visualize statistical data effectively.

## Built With

- **Frontend**: React, TypeScript, Vite, Tailwind CSS
- **Backend**: Python (FastAPI/Flask, Scikit-Learn, XGBoost, Pandas)

## License

This project is proprietary and confidential.
