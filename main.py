"""Vercel ASGI entrypoint — single FastAPI app (API + SPA via app.frontend())."""
from backend.main import app  # noqa: F401
