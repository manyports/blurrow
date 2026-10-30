import { Button } from "@/components/ui/Button";

function ChevronLeftIcon() {
  return (
    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
}

export default function ButtonIcon() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-6">
      <div className="flex gap-1.5">
        <Button variant="secondary" size="icon" aria-label="previous"><ChevronLeftIcon /></Button>
        <Button variant="secondary" size="icon" aria-label="next"><ChevronRightIcon /></Button>
      </div>
      <div className="flex gap-1.5">
        <Button variant="secondary" size="sm" square aria-label="previous"><ChevronLeftIcon /></Button>
        <Button variant="primary" size="sm" square aria-label="next"><ChevronRightIcon /></Button>
      </div>
    </div>
  );
}
