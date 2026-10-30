import React from "react";

type SkeletonVariant = "text" | "circle" | "rect" | "card";

interface SkeletonProps {
  variant?: SkeletonVariant;
  width?: string | number;
  height?: string | number;
  lines?: number;
  className?: string;
  /** What is loading, for screen readers */
  label?: string;
}

/* Placeholders are empty sunken wells — the shape of what will fill them —
   with a light sweep travelling across, rather than a blink.            */
const base = "skeleton-sheen relative overflow-hidden rounded-[8px]";
const well: React.CSSProperties = { background: "var(--well)", boxShadow: "var(--well-shadow)" };

export function Skeleton({
  variant = "text",
  width,
  height,
  lines = 1,
  className = "",
  label = "Loading",
}: SkeletonProps) {
  const a11y = { role: "status", "aria-busy": true, "aria-label": label } as const;

  if (variant === "circle") {
    return (
      <div
        {...a11y}
        className={[base, "rounded-full", className].join(" ")}
        style={{ ...well, width: width ?? 40, height: height ?? 40 }}
      />
    );
  }

  if (variant === "card") {
    return (
      <div
        {...a11y}
        className={["rounded-[20px] p-1.5", className].join(" ")}
        style={{ background: "var(--panel-bezel)", boxShadow: "var(--panel-shadow)" }}
      >
        <div className="bg-white rounded-[15px] p-1.5" style={{ boxShadow: "var(--panel-face-shadow)" }}>
          <div className={[base, "w-full rounded-[11px]"].join(" ")} style={{ ...well, height: height ?? 160 }} />
          <div className="px-3.5 pt-4 pb-3.5 flex flex-col gap-2.5">
            <div className={[base, "h-3.5 w-3/5"].join(" ")} style={well} />
            <div className={[base, "h-2.5 w-full"].join(" ")} style={well} />
            <div className={[base, "h-2.5 w-4/5"].join(" ")} style={well} />
          </div>
        </div>
      </div>
    );
  }

  if (variant === "rect") {
    return (
      <div
        {...a11y}
        className={[base, "rounded-[12px]", className].join(" ")}
        style={{ ...well, width: width ?? "100%", height: height ?? 80 }}
      />
    );
  }

  return (
    <div {...a11y} className={["flex flex-col gap-2", className].join(" ")}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={[base, "h-2.5 rounded-full"].join(" ")}
          style={{
            ...well,
            width: width ?? (i === lines - 1 && lines > 1 ? "60%" : "100%"),
          }}
        />
      ))}
    </div>
  );
}
