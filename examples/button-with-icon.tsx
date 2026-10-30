import { Button } from "@/components/ui/Button";

function ArrowRightIcon() {
  return (
    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
    </svg>
  );
}

export default function ButtonWithIcon() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <Button variant="secondary">
        Read the docs <ArrowRightIcon />
      </Button>
      <Button variant="primary">
        Continue <ArrowRightIcon />
      </Button>
    </div>
  );
}
