import { ReadingProgress } from "@/components/ui/ReadingProgress";

export default function ReadingProgressDemo() {
  return (
    <>
      <ReadingProgress />
      <p className="text-[13px] text-ink-muted">scroll the page and the bar at the very top fills as you go.</p>
    </>
  );
}
