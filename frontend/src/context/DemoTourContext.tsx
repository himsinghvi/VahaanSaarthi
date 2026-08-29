import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { useAssistant } from "./AssistantContext";
import {
  DEMO_TOUR_QUESTION,
  stepsForAudience,
  type DemoTourStep,
} from "../lib/demoTourSteps";

type DemoTourContextValue = {
  active: boolean;
  stepIndex: number;
  steps: DemoTourStep[];
  step: DemoTourStep | null;
  autoplay: boolean;
  startTour: (opts?: { autoplay?: boolean }) => void;
  endTour: () => void;
  next: () => void;
  prev: () => void;
  askDemoQuestion: () => void;
  toggleAutoplay: () => void;
};

const DemoTourContext = createContext<DemoTourContextValue | null>(null);

export function DemoTourProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const nav = useNavigate();
  const { openAssistant, closeAssistant } = useAssistant();
  const [active, setActive] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(false);
  const advancedForRoute = useRef<string | null>(null);

  const steps = useMemo(() => stepsForAudience(!!user), [user]);
  const step = active ? steps[stepIndex] ?? null : null;

  const wasGuestTour = useRef(false);

  const runStepEnter = useCallback(
    (s: DemoTourStep) => {
      if (s.route) nav(s.route);
      if (s.id === "ai-chat") openAssistant();
      else closeAssistant();
    },
    [nav, openAssistant, closeAssistant],
  );

  useEffect(() => {
    if (active && !user) wasGuestTour.current = true;
    if (!active || !user || !wasGuestTour.current) return;
    wasGuestTour.current = false;
    const authSteps = stepsForAudience(true);
    const dashIdx = authSteps.findIndex((s) => s.id === "dashboard");
    if (dashIdx < 0) return;
    advancedForRoute.current = "/dashboard";
    setStepIndex(dashIdx);
    runStepEnter(authSteps[dashIdx]!);
  }, [user, active, runStepEnter]);

  const endTour = useCallback(() => {
    setActive(false);
    setStepIndex(0);
    setAutoplay(false);
    advancedForRoute.current = null;
  }, []);

  const goTo = useCallback(
    (idx: number) => {
      const tourSteps = stepsForAudience(!!user);
      const clamped = Math.max(0, Math.min(idx, tourSteps.length - 1));
      advancedForRoute.current = null;
      setStepIndex(clamped);
      const s = tourSteps[clamped];
      if (s) runStepEnter(s);
    },
    [user, runStepEnter],
  );

  const next = useCallback(() => {
    const tourSteps = stepsForAudience(!!user);
    if (stepIndex >= tourSteps.length - 1) {
      endTour();
      return;
    }
    goTo(stepIndex + 1);
  }, [user, stepIndex, goTo, endTour]);

  const prev = useCallback(() => {
    if (stepIndex <= 0) return;
    goTo(stepIndex - 1);
  }, [stepIndex, goTo]);

  const startTour = useCallback(
    (opts?: { autoplay?: boolean }) => {
      const isAuthed = !!user;
      const tourSteps = stepsForAudience(isAuthed);
      setAutoplay(!!opts?.autoplay);
      setStepIndex(0);
      setActive(true);
      advancedForRoute.current = null;
      if (!isAuthed) nav("/");
      if (tourSteps[0]) runStepEnter(tourSteps[0]);
    },
    [user, nav, runStepEnter],
  );

  const askDemoQuestion = useCallback(() => {
    openAssistant();
    window.dispatchEvent(
      new CustomEvent("demo-tour-ask", { detail: DEMO_TOUR_QUESTION }),
    );
  }, [openAssistant]);

  const toggleAutoplay = useCallback(() => setAutoplay((v) => !v), []);

  const value = useMemo(
    () => ({
      active,
      stepIndex,
      steps,
      step,
      autoplay,
      startTour,
      endTour,
      next,
      prev,
      askDemoQuestion,
      toggleAutoplay,
    }),
    [
      active,
      stepIndex,
      steps,
      step,
      autoplay,
      startTour,
      endTour,
      next,
      prev,
      askDemoQuestion,
      toggleAutoplay,
    ],
  );

  return (
    <DemoTourContext.Provider value={value}>
      {children}
      <DemoTourRouteWatcher
        active={active}
        step={step}
        stepIndex={stepIndex}
        steps={steps}
        onAdvance={next}
        advancedForRoute={advancedForRoute}
      />
    </DemoTourContext.Provider>
  );
}

function DemoTourRouteWatcher({
  active,
  step,
  stepIndex,
  steps,
  onAdvance,
  advancedForRoute,
}: {
  active: boolean;
  step: DemoTourStep | null;
  stepIndex: number;
  steps: DemoTourStep[];
  onAdvance: () => void;
  advancedForRoute: React.MutableRefObject<string | null>;
}) {
  const { pathname } = useLocation();

  useEffect(() => {
    if (!active || !step?.waitForRoute) return;
    if (pathname !== step.waitForRoute) return;
    if (advancedForRoute.current === step.waitForRoute) return;
    advancedForRoute.current = step.waitForRoute;
    const t = window.setTimeout(() => {
      if (stepIndex < steps.length - 1) onAdvance();
    }, 700);
    return () => window.clearTimeout(t);
  }, [active, step, pathname, stepIndex, steps.length, onAdvance, advancedForRoute]);

  return null;
}

export function useDemoTour() {
  const ctx = useContext(DemoTourContext);
  if (!ctx) throw new Error("useDemoTour must be used within DemoTourProvider");
  return ctx;
}
