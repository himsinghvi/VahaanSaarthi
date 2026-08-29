# Vaahan Saarthi — 2-Minute Demo Video Script

**Total runtime:** 2:00 max  
**Tone:** Confident, citizen-first, clear — not salesy  
**Demo login:** `himanshu@example.com` / `demo123`  
**Live URL:** https://vahaansaarthi.vercel.app/

---

## MINUTE 1 — Demo as a Citizen (0:00 – 1:00)

| Time | Screen to Show | Script |
|------|----------------|--------|
| **0:00–0:08** | **Browser — Login page** (`/`). Show the Vaahan Saarthi logo and tagline. | "Meet **Vaahan Saarthi** — India's AI-powered vehicle companion. One app for your entire vehicle journey — from buying, to registering, to maintaining, insuring, and eventually selling or scrapping." |
| **0:08–0:14** | **Login page** — type demo credentials and sign in. | "I'm logging in as a regular citizen — no special access, just a normal user with a few vehicles in my garage." |
| **0:14–0:22** | **Dashboard** (`/#/dashboard`). Pan across greeting, stat cards, vehicle carousel. | "This is my **command centre**. At a glance I see all my vehicles, pending actions, compliance alerts, and monthly spend — not scattered across five government portals." |
| **0:22–0:30** | **Dashboard** — point to compliance score, health score, and a critical reminder (e.g. PUC expiring). | "Each vehicle gets a **digital twin** — a living profile with a compliance score, health score, and smart reminders. I know *before* a fine hits, not after." |
| **0:30–0:38** | **Garage** (`/#/garage`) — show Hyundai Creta, Honda Activa, Tata Nexon EV cards. Tap into **Vehicle Profile** (`/#/garage/veh_creta`). | "My entire garage in one place — car, scooter, EV. Tap any vehicle and I see its documents, challans, expenses, and full timeline in one screen." |
| **0:38–0:46** | **Documents** (`/#/documents`) — show uploaded RC, insurance, PUC. Optionally demo **Upload** button. | "I upload my RC or insurance policy once. **OCR reads it**, classifies it, extracts expiry dates, and sets renewal reminders automatically. No re-typing, no lost papers." |
| **0:46–0:52** | **Challans** (`/#/challans`) — show pending e-challans with plain-language explanations. | "Pending challans are explained in **plain Hindi-English** — what the violation means, how to pay, and how to dispute if needed. Not a cryptic government error code." |
| **0:52–1:00** | **AI Assistant** (floating panel, bottom-right ✨) — ask: *"My Creta PUC is expiring — what should I do?"* Show the agent reply and action cards. | "And when I'm confused, I just **ask**. The AI advisor understands my vehicle, routes to the right specialist agent, and gives me actionable next steps — not a FAQ page." |

---

## MINUTE 2 — How We Built It & Why (1:00 – 2:00)

| Time | Screen to Show | Script |
|------|----------------|--------|
| **1:00–1:08** | **Split or cut to slide / talking head**, OR show **Landing/Welcome page** (`/#/welcome`) lifecycle section scrolling. | "Today, a citizen juggles **Parivahan** for registration, **mParivahan** for licence, **DigiLocker** for documents, **e-Challan** for fines, and insurer apps for policy — none of them talk to each other. Vaahan Saarthi replaces that fragmentation with one intelligent layer." |
| **1:08–1:16** | **Architecture slide** (draw or show repo structure: `frontend/`, `backend/`, `vercel.json`). Optionally flash **GitHub repo** in browser. | "We built it as a **full-stack monorepo** — a React + Vite frontend and a FastAPI Python backend — deployed together on Vercel using their **Services** model. One domain, one deployment, zero DevOps overhead." |
| **1:16–1:26** | **Settings page** (`/#/settings`, admin login if needed) — show **AI Model selector** with GPT-5.4, GPT-4o, Codex listed. OR show `backend/models_registry.py` in IDE briefly. | "The brain runs on **OpenAI models via Azure** — including **GPT-5.4** for reasoning and synthesis, and **Codex** for structured extraction tasks. An admin can switch models at runtime without redeploying." |
| **1:26–1:36** | **IDE — `backend/ai.py`** (or animated diagram of 8 agents). Cut back to **AI Assistant** showing a RTO or insurance reply. | "We didn't build one chatbot — we built an **agentic orchestrator**. It classifies your intent and routes to eight specialist agents: Buying Advisor, RTO Rules, Document, Insurance, Compliance, Maintenance, Accident, and more. Each agent pulls context from *your* garage, not generic web answers." |
| **1:36–1:46** | **Documents upload flow** OR **IDE — `backend/ocr_service.py` + `vehicle_intel.py`**. Show extracted fields on screen after upload. | "Document uploads go through an **OCR → classify → extract → link** pipeline. RC fields, expiry dates, and vehicle numbers are pulled automatically using GPT-powered JSON extraction — so the citizen never fills the same form twice." |
| **1:46–1:54** | **Buy page** (`/#/buy`) or **RTO Agents** (`/#/agents`) — show EMI calculator or agent directory with ratings. | "For buying, we built fuel-cost calculators, on-road price estimators, and EMI tools. For RTO work, we surface **verified local agents** with ratings — because the government portal tells you *what* form to fill, not *who* can help you fill it." |
| **1:54–2:00** | **Dashboard** or **Landing hero** — end on Vaahan Saarthi logo / tagline. Optional: show live URL. | "Vaahan Saarthi is not just another government form portal. It's a **citizen-first operating system for your vehicle** — proactive, intelligent, and built for the way Indians actually own and use vehicles. Thank you." |

---

## Quick Reference — Screen Map

| Feature | Route | What to Highlight |
|---------|-------|-------------------|
| Login | `/` | Simple citizen auth |
| Dashboard | `/#/dashboard` | Stats, reminders, vehicle carousel |
| Garage | `/#/garage` | Multi-vehicle digital twin |
| Vehicle Profile | `/#/garage/:id` | Documents, challans, expenses, timeline |
| Documents | `/#/documents` | OCR upload, auto-classification |
| Challans | `/#/challans` | Plain-language violation explainers |
| AI Assistant | Floating ✨ button (any page) | Agentic Q&A with action cards |
| Buy Advisor | `/#/buy` | EV vs petrol, EMI, on-road price |
| RTO Services | `/#/rto` | Guided ownership-transfer workflows |
| RTO Agents | `/#/agents` | Local agent directory with ratings |
| Maintenance | `/#/maintenance` | Service tracking, expense log |
| Insurance | `/#/insurance` | Policy analyser |
| Settings (admin) | `/#/settings` | GPT-5.4 / Codex model selector |
| Welcome/Landing | `/#/welcome` | Full lifecycle story (9 stages) |

---

## Why We're Better Than Existing Govt Solutions

Use these talking points in Minute 2 (pick 2–3, don't read all):

| Govt Solution | Limitation | Vaahan Saarthi Advantage |
|---------------|------------|--------------------------|
| **Parivahan / mParivahan** | Transactional — one task per visit, no memory of your vehicles | Persistent **digital twin** that remembers everything across visits |
| **DigiLocker** | Passive document storage — no reminders, no compliance scoring | Active vault with **OCR extraction**, expiry tracking, and auto-reminders |
| **e-Challan portal** | Lists fines with legal jargon | **Plain-language explainers** + pay/dispute guidance in context of your vehicle |
| **Insurer apps** | Siloed to one policy | Unified view across **all vehicles and all document types** |
| **RTO offices / agents** | No transparency on agent quality | **Rated agent directory** with services, charges, and response times |
| **All of the above** | No AI guidance — citizen must know which portal to visit | **One AI advisor** that routes to the right specialist agent automatically |

---

## AI / Tech Stack Cheat Sheet (for Minute 2)

| Layer | Technology | Why We Chose It |
|-------|-----------|-----------------|
| Frontend | React + Vite + TypeScript | Fast, modern SPA; great DX for rapid UI iteration |
| Backend | FastAPI (Python) | Async-ready, typed, ideal for AI/OCR pipelines |
| Deployment | Vercel Services | Frontend + backend on one domain, zero server management |
| LLM (primary) | **OpenAI GPT-5.4** via Azure | Best reasoning for multi-step citizen queries |
| LLM (extraction) | **OpenAI Codex** | Structured JSON extraction from RC/OCR text |
| LLM (fallback) | GPT-4o, o4-mini | Speed vs depth trade-offs, runtime-switchable |
| OCR | OCR.space + GPT vision fallback | Free-tier OCR with AI backup for messy scans |
| Live data | Tavily web search | Grounds answers in current fuel prices, RTO rules, launches |
| Architecture | Agentic orchestrator (8 agents) | One entry point, many specialists — not a single generic chatbot |

---

## Recording Tips

1. **Pre-load the demo account** — log in before recording; garage should show Creta, Activa, Nexon EV.
2. **Use 1080p browser zoom at 100%** — the UI is dark-themed; avoid glare.
3. **Minute 1 = no talking about code** — stay in the browser, play the citizen.
4. **Minute 2 = mix browser + 1–2 IDE/slide shots** — keep it visual, not a lecture.
5. **AI Assistant demo** — prepare this question in advance: *"My Creta PUC is expiring — what should I do?"*
6. **Hard stop at 2:00** — the closing line at 1:54 is designed to land at exactly 2:00.

---

## Project Summary

**Vaahan Saarthi** is an AI-powered vehicle companion for Indian citizens. It replaces the fragmented ownership experience — Parivahan, mParivahan, DigiLocker, e-Challan, and insurer apps — with one intelligent layer for the full vehicle lifecycle: buying, registering, maintaining, insuring, and eventually selling or scrapping.

Every vehicle in a user's garage becomes a **digital twin**: a living profile with compliance and health scores, proactive reminders, a document vault, expense tracking, and a unified timeline. Upload RC or insurance once; OCR classifies the file, extracts fields and expiry dates, and links it to the right vehicle — no re-typing, no lost papers. Pending challans are explained in plain Hindi-English with pay and dispute guidance.

An **agentic AI orchestrator** routes questions to eight specialist agents (Buying, RTO, Documents, Insurance, Compliance, Maintenance, and more). The floating assistant pulls context from *your* garage and returns actionable next steps, not generic FAQs.

Built as a **full-stack monorepo** — React + Vite + TypeScript frontend, FastAPI Python backend — deployed together on **Vercel Services** at one domain. LLMs run on Azure OpenAI (GPT-5.4, Codex, GPT-4o); admins can switch models at runtime. A built-in **demo tour** walks through Minute 1 of this script for easy recording.

**Live:** https://vahaansaarthi.vercel.app/ · **Demo:** `himanshu@example.com` / `demo123`
