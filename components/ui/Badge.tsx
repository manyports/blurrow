import React from "react";

type BadgeVariant = "default" | "muted" | "accent";

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "text-white",
  muted: "text-neutral-600",
  accent: "text-violet-700",
};

/* Badges are small raised faces, lit from the same top edge as buttons. */
const variantSurfaces: Record<BadgeVariant, React.CSSProperties> = {
  default: {
    background: "var(--face-dark)",
    boxShadow:
      "0 0 3px rgba(0,0,0,0.35), 0 1px 2px rgba(0,0,0,0.2), inset 0 2px 3px -2px rgba(255,255,255,0.105)",
    textShadow: "0 -1px 0 rgba(0,0,0,0.4)",
  },
  muted: {
    background: "linear-gradient(180deg, #ffffff 0%, #f1f1f1 100%)",
    boxShadow:
      "0 0 3px rgba(17,17,17,0.119), 0 1px 1.5px rgba(17,17,17,0.07), inset 0 2px 3px -2px rgba(255,255,255,1)",
    textShadow: "0 1px 0 rgba(255,255,255,0.9)",
  },
  accent: {
    background: "linear-gradient(180deg, #f5f0ff 0%, #ebe1ff 100%)",
    boxShadow:
      "0 0 3px rgba(124,58,237,0.255), 0 1px 1.5px rgba(124,58,237,0.12), inset 0 2px 3px -2px rgba(255,255,255,0.637)",
    textShadow: "0 1px 0 rgba(255,255,255,0.7)",
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
