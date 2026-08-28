# Vaahan Saarthi — local dev (same /api paths as Vercel production)
# Usage: ./start.ps1

$ErrorActionPreference = "Stop"
$root = $PSScriptRoot

Write-Host "Starting Vaahan Saarthi (full_app)..." -ForegroundColor Magenta

Start-Process powershell -ArgumentList @(
  "-NoExit", "-Command",
  "cd `"$root`"; if (!(Test-Path .venv)) { python -m venv .venv; .\.venv\Scripts\python.exe -m pip install -r requirements.txt }; .\.venv\Scripts\python.exe -m uvicorn app.main:app --host 127.0.0.1 --port 8020 --reload"
)

Start-Process powershell -ArgumentList @(
  "-NoExit", "-Command",
  "cd `"$root\frontend`"; if (!(Test-Path node_modules)) { npm install }; npm run dev"
)

Write-Host "Backend:  http://127.0.0.1:8020/api/health" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:5199" -ForegroundColor Cyan
Write-Host "Deploy:   set Vercel Root Directory to full_app" -ForegroundColor Yellow
