import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import VehicleAuthScene from "../components/VehicleAuthScene";
import AppLogo from "../components/AppLogo";
import DemoTourTrigger, { DemoTourAutoplayTrigger } from "../components/DemoTourTrigger";
import { useAuth } from "../context/AuthContext";
import { useDemoTour } from "../context/DemoTourContext";

type Mode = "login" | "signup";

const HERO_LINE =
  "Meet Vaahan Saarthi — India's AI-powered vehicle companion. One app for your entire vehicle journey — from buying, to registering, to maintaining, insuring, and eventually selling or scrapping.";

const DEMO_USERS = [
  {
    name: "Himanshu",
    email: "himanshu@example.com",
    password: "demo123",
    hint: "Full garage — 3 vehicles, docs & challans",
    emoji: "🚗",
  },
  {
    name: "Sachin",
    email: "sachin@example.com",
    password: "demo123",
    hint: "Fresh account — empty garage to explore",
    emoji: "🛵",
  },
];

export default function Auth() {
  const nav = useNavigate();
  const { login, signup } = useAuth();
  const { active: tourActive, step: tourStep } = useDemoTour();
  const [panelOpen, setPanelOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("login");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
  });

  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const go = async (fn: () => Promise<void>) => {
    setErr("");
    setBusy(true);
    try {
      await fn();
      nav("/dashboard", { replace: true });
    } catch (e: unknown) {
      const detail = (e as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
      setErr(typeof detail === "string" ? detail : "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const submitLogin = () => {
    if (!form.email.trim() || !form.password) {
      setErr("Enter email and password.");
      return;
    }
    go(() => login(form.email, form.password));
  };

  const submitSignup = () => {
    if (!form.name.trim() || !form.email.trim() || !form.mobile.trim() || !form.password) {
      setErr("Fill in all fields to create your account.");
      return;
    }
    go(() => signup(form));
  };

  const quickLogin = (email: string, password: string) => {
    setForm((f) => ({ ...f, email, password }));
    go(() => login(email, password));
  };

  const openPanel = (nextMode: Mode) => {
    setMode(nextMode);
    setErr("");
    setPanelOpen(true);
  };

  const closePanel = () => {
    setPanelOpen(false);
    setErr("");
  };

  useEffect(() => {
    if (tourActive && tourStep?.id === "demo-login") {
      setPanelOpen(true);
      setMode("login");
    }
  }, [tourActive, tourStep?.id]);

  return (
    <div className="auth-page">
      <VehicleAuthScene />
      <div className="auth-page__overlay" aria-hidden />

      <div className="auth-page__layout">
        <motion.section
          className="auth-hero"
          data-demo-tour="auth-brand"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <div className="auth-hero__brand">
            <AppLogo variant="full" height={64} className="auth-hero__logo" />
          </div>
          <h1 className="auth-hero__display">
            <span>crafted for the</span>
            <span>vehicle owner</span>
          </h1>
          <p className="auth-hero__tagline">{HERO_LINE}</p>

          <div className="auth-hero__tour">
            <DemoTourTrigger />
            <DemoTourAutoplayTrigger />
          </div>
        </motion.section>

        <motion.aside
          className="auth-panel-wrap"
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, delay: 0.15, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <div className={`auth-card glass ${panelOpen ? "auth-card--open" : "auth-card--collapsed"}`}>
            <AnimatePresence mode="wait" initial={false}>
              {!panelOpen ? (
                <motion.div
                  key="collapsed"
                  className="auth-card__collapsed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="auth-card__collapsed-brand">
                    <AppLogo variant="mark" height={44} />
                    <div>
                      <div className="auth-card__collapsed-title">Enter your garage</div>
                      <div className="text-muted-2" style={{ fontSize: ".82rem" }}>
                        Log in or create an account
                      </div>
                    </div>
                  </div>

                  <div className="auth-card__collapsed-actions">
                    <button type="button" className="btn-grad w-100" onClick={() => openPanel("login")}>
                      Log in
                    </button>
                    <button type="button" className="btn-ghost w-100" onClick={() => openPanel("signup")}>
                      Sign up
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="expanded"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 12 }}
                  transition={{ duration: 0.28 }}
                >
                  <div className="auth-card__expanded-head">
                    <div className="auth-tabs">
                      <button
                        type="button"
                        className={`auth-tab ${mode === "login" ? "active" : ""}`}
                        onClick={() => { setMode("login"); setErr(""); }}
                      >
                        Log in
                      </button>
                      <button
                        type="button"
                        className={`auth-tab ${mode === "signup" ? "active" : ""}`}
                        onClick={() => { setMode("signup"); setErr(""); }}
                      >
                        Sign up
                      </button>
                    </div>
                    <button type="button" className="auth-card__close" onClick={closePanel} aria-label="Close">
                      ✕
                    </button>
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={mode}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.25 }}
                    >
                      <h2 className="auth-card__title">
                        {mode === "login" ? "Welcome back" : "Create your garage"}
                      </h2>
                      <p className="text-muted-2 auth-card__sub">
                        {mode === "login"
                          ? "Sign in to manage vehicles, RTO, documents & AI assistant."
                          : "One account for your entire vehicle lifecycle in India."}
                      </p>

                      {mode === "signup" && (
                        <div className="mb-3">
                          <label className="auth-label">Full name</label>
                          <input className="form-control" placeholder="Himanshu Sharma" value={form.name} onChange={(e) => set("name", e.target.value)} />
                        </div>
                      )}

                      <div className="mb-3">
                        <label className="auth-label">Email</label>
                        <input className="form-control" type="email" placeholder="you@example.com" value={form.email} onChange={(e) => set("email", e.target.value)} />
                      </div>

                      {mode === "signup" && (
                        <div className="mb-3">
                          <label className="auth-label">Mobile</label>
                          <input className="form-control" placeholder="+91 98765 43210" value={form.mobile} onChange={(e) => set("mobile", e.target.value)} />
                        </div>
                      )}

                      <div className="mb-3">
                        <label className="auth-label">Password</label>
                        <input
                          className="form-control"
                          type="password"
                          placeholder="••••••••"
                          value={form.password}
                          onChange={(e) => set("password", e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && (mode === "login" ? submitLogin() : submitSignup())}
                        />
                      </div>

                      {err && <div className="auth-err mb-3">{err}</div>}

                      <button
                        type="button"
                        className="btn-grad w-100 auth-submit"
                        disabled={busy}
                        onClick={mode === "login" ? submitLogin : submitSignup}
                      >
                        {busy ? "Starting engine…" : mode === "login" ? "Log in →" : "Create account →"}
                      </button>
                    </motion.div>
                  </AnimatePresence>

                  {mode === "login" && (
                    <>
                      <div className="auth-divider"><span>demo accounts</span></div>
                      <div className="auth-demo-users">
                        {DEMO_USERS.map((u) => (
                          <button
                            key={u.email}
                            type="button"
                            className="auth-demo-user"
                            data-demo-tour={u.email === "himanshu@example.com" ? "auth-demo-user" : undefined}
                            disabled={busy}
                            onClick={() => quickLogin(u.email, u.password)}
                          >
                            <span className="auth-demo-user__emoji">{u.emoji}</span>
                            <span className="auth-demo-user__body">
                              <span className="auth-demo-user__name">{u.name}</span>
                              <span className="auth-demo-user__creds">{u.email} · {u.password}</span>
                              <span className="auth-demo-user__hint">{u.hint}</span>
                            </span>
                            <span className="auth-demo-user__go">→</span>
                          </button>
                        ))}
                      </div>
                    </>
                  )}

                  <p className="auth-foot text-muted-2">
                    🇮🇳 Built for India
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.aside>
      </div>
    </div>
  );
}
