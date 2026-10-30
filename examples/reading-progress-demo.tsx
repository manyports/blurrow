import { ReadingProgress } from "@/components/ui/ReadingProgress";

export default function ReadingProgressDemo() {
  return (
    <>
      <ReadingProgress />
      <p className="text-[13px] text-neutral-500">scroll the page and the bar at the very top fills as you go.</p>
    </>
  );
}
