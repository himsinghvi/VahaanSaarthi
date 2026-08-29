import { useCallback, useEffect, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useDemoTour } from "../context/DemoTourContext";

const PAD = 10;

type Rect = { top: number; left: number; width: number; height: number };

function measureTarget(targetId: string): Rect | null {
  const el = document.querySelector(`[data-demo-tour="${targetId}"]`);
  if (!el) return null;
  const r = el.getBoundingClientRect();
  return {
    top: r.top - PAD,
    left: r.left - PAD,
    width: r.width + PAD * 2,
    height: r.height + PAD * 2,
  };
}

export default function DemoTour() {
  const {
    active,
    step,
    stepIndex,
    steps,
    autoplay,
    next,
    prev,
    endTour,
    askDemoQuestion,
    toggleAutoplay,
  } = useDemoTour();
  const [rect, setRect] = useState<Rect | null>(null);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(() => {
    if (!step) return;
    const r = measureTarget(step.target);
    setRect(r);
    setReady(!!r);
  }, [step]);

  useEffect(() => {
    if (!active || !step) {
      setRect(null);
      setReady(false);
      return;
    }

    setReady(false);
    let tries = 0;
    const poll = window.setInterval(() => {
      const r = measureTarget(step.target);
      if (r) {
        setRect(r);
        setReady(true);
        window.clearInterval(poll);
      }
      tries += 1;
      if (tries > 60) window.clearInterval(poll);
    }, 80);

    return () => window.clearInterval(poll);
  }, [active, step]);

  useEffect(() => {
    if (!active) return;
    const onMove = () => refresh();
    window.addEventListener("resize", onMove);
    window.addEventListener("scroll", onMove, true);
    return () => {
      window.removeEventListener("resize", onMove);
      window.removeEventListener("scroll", onMove, true);
    };
  }, [active, refresh]);

  useEffect(() => {
    if (!active || !autoplay || !step?.autoplaySec) return;
    const t = window.setTimeout(next, step.autoplaySec * 1000);
    return () => window.clearTimeout(t);
  }, [active, autoplay, step, stepIndex, next]);

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") endTour();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, next, prev, endTour]);

  if (!active || !step) return null;

  const isLast = stepIndex >= steps.length - 1;
  const tooltipStyle = getTooltipStyle(rect, step.placement ?? "bottom");

  return createPortal(
    <AnimatePresence>
      <motion.div
        className="demo-tour-root"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        aria-live="polite"
      >
        {rect && ready && (
          <>
            <motion.div
              className="demo-tour-spotlight"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
              style={{
                top: rect.top,
                left: rect.left,
                width: rect.width,
                height: rect.height,
              }}
            />
            <motion.div
              className="demo-tour-pulse"
              animate={{ scale: [1, 1.04, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
              style={{
                top: rect.top,
                left: rect.left,
                width: rect.width,
                height: rect.height,
              }}
            />
          </>
        )}

        <motion.div
          className="demo-tour-card glass"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          style={tooltipStyle}
          role="dialog"
          aria-labelledby="demo-tour-title"
        >
          <div className="demo-tour-card__head">
            <span className="demo-tour-badge">🎬 Demo · Minute 1</span>
            <span className="demo-tour-progress">
              {stepIndex + 1} / {steps.length}
            </span>
          </div>

          <div className="demo-tour-progress-bar">
            <motion.div
              className="demo-tour-progress-bar__fill"
              animate={{ width: `${((stepIndex + 1) / steps.length) * 100}%` }}
              transition={{ duration: 0.35 }}
            />
          </div>

          <h3 id="demo-tour-title" className="demo-tour-card__title">
            {step.title}
          </h3>
          <p className="demo-tour-card__body">{step.body}</p>

          <blockquote className="demo-tour-script">
            <span className="demo-tour-script__label">🎙 Script</span>
            {step.script}
          </blockquote>

          {!ready && (
            <p className="demo-tour-wait text-muted-2">Loading this screen…</p>
          )}

          <div className="demo-tour-actions">
            <button type="button" className="btn-ghost demo-tour-btn" onClick={endTour}>
              Skip tour
            </button>
            <div className="demo-tour-actions__main">
              <button
                type="button"
                className="btn-ghost demo-tour-btn"
                disabled={stepIndex === 0}
                onClick={prev}
              >
                ← Back
              </button>
              {step.id === "ai-chat" && (
                <button type="button" className="btn-grad demo-tour-btn" onClick={askDemoQuestion}>
                  Ask demo question ✨
                </button>
              )}
              <button type="button" className="btn-grad demo-tour-btn" onClick={next}>
                {isLast ? "Finish" : "Next →"}
              </button>
            </div>
          </div>

          <label className="demo-tour-autoplay">
            <input type="checkbox" checked={autoplay} onChange={() => toggleAutoplay()} />
            Auto-play (~1 min, matches video script timing)
          </label>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body,
  );
}

function getTooltipStyle(
  rect: Rect | null,
  placement: "top" | "bottom" | "left" | "right",
): CSSProperties {
  if (!rect) {
    return {
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      maxWidth: 420,
      zIndex: 10002,
    };
  }

  const gap = 16;
  const base: CSSProperties = {
    position: "fixed",
    maxWidth: 420,
    zIndex: 10002,
  };

  switch (placement) {
    case "top":
      return {
        ...base,
        left: Math.min(Math.max(rect.left, 12), window.innerWidth - 432),
        bottom: window.innerHeight - rect.top + gap,
      };
    case "left":
      return {
        ...base,
        right: window.innerWidth - rect.left + gap,
        top: Math.min(Math.max(rect.top, 12), window.innerHeight - 280),
      };
    case "right":
      return {
        ...base,
        left: rect.left + rect.width + gap,
        top: Math.min(Math.max(rect.top, 12), window.innerHeight - 280),
      };
    default:
      return {
        ...base,
        left: Math.min(Math.max(rect.left, 12), window.innerWidth - 432),
        top: rect.top + rect.height + gap,
      };
  }
}
