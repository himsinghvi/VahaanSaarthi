"""Vercel serverless entry — exposes the FastAPI app at /api/*."""
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from app.main import app as fastapi_app

app = fastapi_app
