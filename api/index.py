"""Vercel API entry — mounts FastAPI at /api/* only (not project-wide)."""
import sys
from pathlib import Path

BACKEND = Path(__file__).resolve().parent.parent / "backend"
if str(BACKEND) not in sys.path:
    sys.path.insert(0, str(BACKEND))

from main import app as fastapi_app

app = fastapi_app
