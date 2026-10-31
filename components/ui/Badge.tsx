import React from "react";

type BadgeVariant = "default" | "muted" | "accent";

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "text-ink-inverse",
  muted: "text-ink-body",
  accent: "text-accent",
};

/* Badges are small raised faces, lit from the same top edge as buttons. */
const variantSurfaces: Record<BadgeVariant, React.CSSProperties> = {
  default: {
    background: "var(--face-inverse)",
    boxShadow: "var(--badge-inverse-shadow)",
    textShadow: "var(--emboss-inverse)",
  },
  muted: {
    background: "var(--badge)",
    boxShadow: "var(--badge-shadow)",
    textShadow: "var(--emboss)",
  },
  accent: {
    background: "var(--badge-accent)",
    boxShadow: "var(--badge-accent-shadow)",
    textShadow: "var(--emboss-soft)",
  },
};

export function Badge({
  variant = "muted",
  children,
  className = "",
}: BadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium tracking-wide",
        variantStyles[variant],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={variantSurfaces[variant]}
    >
      {children}
    </span>
  );
}
