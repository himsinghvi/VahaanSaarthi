# Vaahan Saarthi — Single Vercel Deployment

An AI-powered, India-focused Vehicle Lifecycle Super App. Add a vehicle once and it becomes a digital twin — Vaahan Saarthi helps you across the entire journey.

Frontend (Vite/React) and backend (FastAPI) in **one** Vercel project on a **single domain**.

```
├── api/index.py       ← Vercel Python entry (routes /api/*)
├── app/               ← FastAPI application
├── frontend/          ← React UI (builds to frontend/dist)
├── vercel.json        ← build + routing
├── requirements.txt   ← Python deps (root — required by Vercel)
└── package.json       ← npm build script
```

## Deploy to Vercel

1. Push this repo to GitHub.
2. In Vercel → **New Project** → import the repo.
3. Framework Preset: **Other** (Vercel reads `vercel.json`).
4. Add environment variables from `.env.example` (Azure OpenAI, Tavily, OCR keys).
5. Deploy.

After deploy, everything is on one URL:

| Path | Served by |
|------|-----------|
| `/` | React SPA (`frontend/dist`) |
| `/api/*` | FastAPI (`api/index.py`) |

## Local development

```powershell
./start.ps1
```

- Frontend: http://localhost:9199 (Vite proxies `/api` → port 8020)
- Backend:  http://127.0.0.1:8020/api/health

Or run separately:

```powershell
python -m venv .venv
.\.venv\Scripts\pip install -r requirements.txt
npm run dev:backend   # terminal 1
npm run dev           # terminal 2 (frontend)
```

Copy `.env.example` → `.env` for API keys.

## Demo login

| Email | Password |
|-------|----------|
| `himanshu@example.com` | `demo123` |
| `admin@vaahansaarthi.com` | `Admin@123` |

## Notes

- Data is stored **in memory** — resets on serverless cold starts. Use a database for production persistence.
- OCR / AI calls may need a longer timeout; `vercel.json` can set `functions` maxDuration if needed.
