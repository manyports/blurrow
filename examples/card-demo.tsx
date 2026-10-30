import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

function ArrowRightIcon() {
  return (
    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
    </svg>
  );
}

export default function CardDemo() {
  return (
    <div className="w-full max-w-md">
      <Card
        title="the quiet art of long-form"
        subtitle="everything we write"
        actions={
          <Button variant="primary" size="sm">
            Read <ArrowRightIcon />
          </Button>
        }
      />
    </div>
  );
}
