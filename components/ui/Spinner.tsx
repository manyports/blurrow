import React from "react";

type SpinnerSize = "sm" | "md" | "lg";

interface SpinnerProps {
  size?: SpinnerSize | number;
  /** Read out to screen readers; the spinner is silent without it */
  label?: string;
  className?: string;
}

const SIZES: Record<SpinnerSize, number> = { sm: 14, md: 18, lg: 24 };

/* A short arc chasing round a faint ring. It takes the text colour, so
   inside a primary button it's light and on the page it's ink.       */
export function Spinner({ size = "md", label, className = "" }: SpinnerProps) {
  const px = typeof size === "number" ? size : SIZES[size];
  return (
    <span
      role={label ? "status" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={["inline-flex shrink-0", className].join(" ")}
      style={{ width: px, height: px }}
    >
      <svg viewBox="0 0 24 24" width={px} height={px} fill="none" className="animate-spin">
        <circle cx="12" cy="12" r="9.5" stroke="currentColor" strokeWidth="2.5" opacity="0.18" />
        <path d="M21.5 12a9.5 9.5 0 0 0-9.5-9.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    </span>
  );
}
