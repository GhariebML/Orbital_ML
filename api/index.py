import sys
import os

# Add the backend directory to the path so main.py can be found
sys.path.append(os.path.join(os.path.dirname(__file__), "..", "backend"))

from main import app

# This is the entry point for Vercel
# The app object needs to be named correctly or exported
# Vercel's @vercel/python looks for an 'app' or 'application' object.
