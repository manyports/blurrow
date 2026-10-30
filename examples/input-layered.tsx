"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

function MailIcon() {
  return (
    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="m3 7 9 6 9-6" />
    </svg>
  );
}

export default function InputLayered() {
  return (
    <form className="flex w-full max-w-md flex-col gap-2 sm:flex-row" onSubmit={(e) => e.preventDefault()}>
      <div className="min-w-0 flex-1">
        <Input layered type="email" placeholder="you@example.com" iconLeft={<MailIcon />} fullWidth />
      </div>
      <Button type="submit" size="lg">
        subscribe
      </Button>
    </form>
  );
}
