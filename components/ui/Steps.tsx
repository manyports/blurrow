import React from "react";

interface StepItem {
  label: string;
  description?: string;
}

interface StepsProps {
  steps: StepItem[];
  current: number;
  className?: string;
}

function CheckIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

/* Upcoming steps are sunken (not yet filled in), done and current steps
   are dark raised faces; the current one also wears a soft halo. Each step owns an equal column, so labels get
   real width instead of being squeezed under a 32px circle.           */
export function Steps({ steps, current, className = "" }: StepsProps) {
  return (
    <ol className={["flex items-start", className].filter(Boolean).join(" ")}>
      {steps.map((step, i) => {
        const isCompleted = i < current;
        const isCurrent = i === current;
        const reached = isCompleted || isCurrent;
        const isLast = i === steps.length - 1;

        return (
          <li
            key={i}
            aria-current={isCurrent ? "step" : undefined}
            className="relative flex-1 min-w-0 flex flex-col items-center text-center"
          >
            {/* One groove per gap, running between the two circles' edges
                (columns are equal, so the next centre is exactly 100% away) */}
            {!isLast && (
              <span
                aria-hidden
                className="absolute top-[15px] h-1 -translate-y-1/2 rounded-full overflow-hidden"
                style={{
                  left: "calc(50% + 25px)",
                  width: "calc(100% - 50px)",
                  background: "var(--well)",
                  boxShadow: "var(--well-shadow)",
                }}
              >
                <span
                  className="block h-full rounded-full origin-left transition-transform duration-500 ease-[var(--ease-out-soft)]"
                  style={{
                    background: "var(--face-dark)",
                    transform: isCompleted ? "scaleX(1)" : "scaleX(0)",
                  }}
                />
              </span>
            )}

            <span
              className={[
                "relative w-[30px] h-[30px] rounded-full flex items-center justify-center text-[12.5px] font-semibold tabular-nums shrink-0",
                "transition-[box-shadow,color] duration-300",
                reached ? "text-white" : "text-neutral-400",
              ].join(" ")}
              style={{
                background: reached ? "var(--face-dark)" : "var(--field)",
                boxShadow: isCurrent
                  ? "var(--face-dark-shadow), 0 0 0 4px rgba(17,17,17,0.06), 0 0 0 5px rgba(17,17,17,0.03)"
                  : reached
                    ? "var(--face-dark-shadow)"
                    : "var(--field-shadow)",
              }}
            >
              {isCompleted ? <CheckIcon /> : i + 1}
              <span className="sr-only">{isCompleted ? " (completed)" : ""}</span>
            </span>

            <span className="mt-3 px-1.5 flex flex-col gap-0.5">
              <span
                className={[
                  "text-[13px] font-medium leading-tight transition-colors duration-200",
                  reached ? "text-neutral-900" : "text-neutral-500",
                ].join(" ")}
              >
                {step.label}
              </span>
              {step.description && (
                <span className="text-[12px] text-neutral-400 leading-snug">{step.description}</span>
              )}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
