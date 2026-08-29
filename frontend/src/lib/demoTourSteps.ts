export type DemoTourAudience = "guest" | "auth" | "all";

export type DemoTourStep = {
  id: string;
  target: string;
  route?: string;
  title: string;
  body: string;
  script: string;
  audience: DemoTourAudience;
  placement?: "top" | "bottom" | "left" | "right";
  /** Auto-advance when user lands on this route (e.g. after demo login). */
  waitForRoute?: string;
  /** Seconds for autoplay mode (matches ~1 min video script). */
  autoplaySec?: number;
};

/** Minute 1 of Video_script.md — citizen demo flow. */
export const DEMO_TOUR_STEPS: DemoTourStep[] = [
  {
    id: "intro",
    target: "auth-brand",
    route: "/",
    title: "Welcome to Vaahan Saarthi",
    body: "India's AI vehicle companion — one app for the full ownership journey: buy, register, maintain, insure, and when the time comes, sell or scrap.",
    script: "Vaahan Saarthi is India's AI vehicle companion — one app for your entire ownership journey.",
    audience: "guest",
    placement: "right",
    autoplaySec: 8,
  },
  {
    id: "demo-login",
    target: "auth-demo-user",
    route: "/",
    title: "Log in as a citizen",
    body: "Click the Himanshu demo account — full garage with 3 vehicles, documents & challans. No special access needed.",
    script: "I'm logging in as a regular citizen — no special access, just a normal user with a few vehicles in my garage.",
    audience: "guest",
    placement: "top",
    autoplaySec: 6,
  },
  {
    id: "dashboard",
    target: "dash-greeting",
    route: "/dashboard",
    title: "Your command centre",
    body: "At a glance: all vehicles, pending actions, compliance alerts, and monthly spend — not scattered across five government portals.",
    script: "This is my command centre. At a glance I see all my vehicles, pending actions, compliance alerts, and monthly spend.",
    audience: "auth",
    placement: "bottom",
    autoplaySec: 8,
  },
  {
    id: "stats",
    target: "dash-stats",
    route: "/dashboard",
    title: "Live garage stats",
    body: "Tap any stat card to jump to Vehicles, Documents, or Challans — everything rolls up here.",
    script: "Not scattered across five government portals — everything in one intelligent dashboard.",
    audience: "auth",
    placement: "bottom",
    autoplaySec: 6,
  },
  {
    id: "digital-twin",
    target: "dash-carousel",
    route: "/dashboard",
    title: "Digital vehicle twin",
    body: "Each vehicle gets a living profile with compliance score, health score, and smart reminders — know before a fine hits.",
    script: "Each vehicle gets a digital twin — a living profile with a compliance score, health score, and smart reminders.",
    audience: "auth",
    placement: "top",
    autoplaySec: 8,
  },
  {
    id: "reminders",
    target: "dash-reminders",
    route: "/dashboard",
    title: "Proactive reminders",
    body: "Critical alerts like PUC expiring surface here first — actionable, not after-the-fact fines.",
    script: "I know before a fine hits, not after.",
    audience: "auth",
    placement: "left",
    autoplaySec: 6,
  },
  {
    id: "garage",
    target: "garage-grid",
    route: "/garage",
    title: "Your entire garage",
    body: "Car, scooter, EV — every vehicle in one place with compliance bars and quick access to its full profile.",
    script: "My entire garage in one place — car, scooter, EV.",
    audience: "auth",
    placement: "bottom",
    autoplaySec: 8,
  },
  {
    id: "vehicle-profile",
    target: "garage-creta",
    route: "/garage",
    title: "Tap into a vehicle profile",
    body: "Open the Hyundai Creta to see documents, challans, expenses, and timeline on one screen.",
    script: "Tap any vehicle and I see its documents, challans, expenses, and full timeline in one screen.",
    audience: "auth",
    placement: "top",
    autoplaySec: 6,
  },
  {
    id: "documents",
    target: "docs-upload",
    route: "/documents",
    title: "Smart document vault",
    body: "Upload RC or insurance once. OCR reads it, classifies it, extracts expiry dates, and sets renewal reminders.",
    script: "I upload my RC or insurance policy once. OCR reads it, classifies it, extracts expiry dates, and sets renewal reminders automatically.",
    audience: "auth",
    placement: "right",
    autoplaySec: 8,
  },
  {
    id: "doc-list",
    target: "docs-list",
    route: "/documents",
    title: "Already classified",
    body: "Uploaded documents are linked to vehicles with status badges — no re-typing, no lost papers.",
    script: "No re-typing, no lost papers.",
    audience: "auth",
    placement: "left",
    autoplaySec: 6,
  },
  {
    id: "challans",
    target: "challans-list",
    route: "/challans",
    title: "Plain-language challans",
    body: "Pending e-challans explained in plain Hindi-English — what the violation means, how to pay, and how to dispute.",
    script: "Pending challans are explained in plain Hindi-English — not a cryptic government error code.",
    audience: "auth",
    placement: "top",
    autoplaySec: 8,
  },
  {
    id: "ai-fab",
    target: "ai-fab",
    route: "/dashboard",
    title: "Ask the AI advisor",
    body: "When you're confused, just ask. The ✨ button opens your context-aware vehicle AI — routes to specialist agents.",
    script: "And when I'm confused, I just ask.",
    audience: "auth",
    placement: "left",
    autoplaySec: 6,
  },
  {
    id: "ai-chat",
    target: "ai-panel",
    route: "/dashboard",
    title: "Try a real question",
    body: 'Ask: "My Creta PUC is expiring — what should I do?" — the AI pulls from your garage and returns actionable steps.',
    script: "The AI advisor understands my vehicle, routes to the right specialist agent, and gives me actionable next steps.",
    audience: "auth",
    placement: "left",
    autoplaySec: 8,
  },
];

export const DEMO_TOUR_QUESTION = "My Creta PUC is expiring — what should I do?";

export function stepsForAudience(isAuthed: boolean): DemoTourStep[] {
  return DEMO_TOUR_STEPS.filter((s) => {
    if (s.audience === "all") return true;
    if (s.audience === "guest") return !isAuthed;
    return isAuthed;
  });
}
