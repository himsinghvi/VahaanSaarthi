import { useDemoTour } from "../context/DemoTourContext";

type Props = {
  className?: string;
  compact?: boolean;
};

export default function DemoTourTrigger({ className = "", compact }: Props) {
  const { active, startTour } = useDemoTour();

  if (active) return null;

  return (
    <button
      type="button"
      className={`demo-tour-trigger ${className}`}
      onClick={() => startTour()}
      title="Guided walkthrough for the 1-minute citizen demo"
    >
      {compact ? "🎬 Demo" : "🎬 Start demo tour"}
    </button>
  );
}

export function DemoTourAutoplayTrigger({ className = "" }: { className?: string }) {
  const { active, startTour } = useDemoTour();
  if (active) return null;
  return (
    <button
      type="button"
      className={`demo-tour-trigger demo-tour-trigger--ghost ${className}`}
      onClick={() => startTour({ autoplay: true })}
    >
      ▶ Auto-play 1 min
    </button>
  );
}
