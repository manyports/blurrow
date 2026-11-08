import React from "react";

interface SeparatorProps {
  orientation?: "horizontal" | "vertical";
  /** A few words set into the middle of the line, like "or" */
  label?: React.ReactNode;
  /** Only draws a line; screen readers skip it */
  decorative?: boolean;
  className?: string;
}

/* A groove scored into the surface: a dark line with a lit lip just
   under it, the way a cut catches light from above.                */
function Groove({ vertical }: { vertical: boolean }) {
  return (
    <span
      aria-hidden
      className={vertical ? "block w-px self-stretch" : "block h-px flex-1"}
      style={{
        background: "var(--groove)",
        boxShadow: vertical ? "var(--groove-lip)" : "var(--groove-lip-below)",
      }}
    />
  );
}

export function Separator({ orientation = "horizontal", label, decorative = false, className = "" }: SeparatorProps) {
  const vertical = orientation === "vertical";
  const a11y = decorative
    ? { "aria-hidden": true as const }
    : { role: "separator", "aria-orientation": orientation };

  if (vertical) {
    return (
      <span {...a11y} className={["inline-flex self-stretch", className].join(" ")}>
        <Groove vertical />
      </span>
    );
  }

  return (
    <div {...a11y} className={["flex w-full items-center gap-3", className].join(" ")}>
      <Groove vertical={false} />
      {label && (
        <>
          <span className="shrink-0 text-[11.5px] font-medium text-ink-faint">{label}</span>
          <Groove vertical={false} />
        </>
      )}
    </div>
  );
}
