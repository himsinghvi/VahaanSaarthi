"""Legacy Vercel /api entry — re-exports the FastAPI app from app.main.

Prefer app/main.py as the primary entrypoint (see pyproject.toml).
"""
from app.main import app as fastapi_app

app = fastapi_app
