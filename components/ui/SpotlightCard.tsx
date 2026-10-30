import React from "react";
import { CardShell } from "./CardShell";

interface SpotlightCardProps {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
  children?: React.ReactNode;
  theme?: "light" | "dark";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const paddingBySize: Record<NonNullable<SpotlightCardProps["size"]>, string> = {
  // Feature cards pad 32px whatever their size; only the type scales
  sm: "p-6",
  md: "p-8",
  lg: "p-8",
};

const titleSizeBySize: Record<
  NonNullable<SpotlightCardProps["size"]>,
  string
> = {
  sm: "text-[20px]",
  md: "text-[26px]",
  lg: "text-[34px]",
};

export function SpotlightCard({
  title,
  subtitle,
  eyebrow,
  icon,
  actions,
  children,
  theme = "dark",
  size = "md",
  className = "",
}: SpotlightCardProps) {
  const dark = theme === "dark";

  return (
    /* Built on CardShell: icon at the top of the face, words and actions
       settled at the bottom — the same rhythm as Card and QuoteCard. */
    <CardShell as="article" theme={theme} className={className}>
      {/* Headline sits low on the face, so tall cards breathe above it, not below */}
      <div className={["relative flex-1 flex flex-col gap-3", paddingBySize[size]].join(" ")}>
        {icon && (
          <div
            className={[
              "w-9 h-9 rounded-[11px] flex items-center justify-center mb-auto",
              dark ? "text-white" : "text-neutral-800",
            ].join(" ")}
            style={{
              background: dark ? "var(--tile-dark)" : "var(--face-light)",
              boxShadow: dark ? "var(--tile-dark-shadow)" : "var(--tile-light-shadow)",
            }}
          >
            {icon}
          </div>
        )}

        {eyebrow && (
          <p
            className={[
              // Without an icon above to push it down, the copy still sits low
              icon ? "pt-8" : "mt-auto",
              "text-[14px] font-medium tracking-[-0.01em]",
              dark ? "text-neutral-400" : "text-neutral-500",
            ].join(" ")}
          >
            {eyebrow}
          </p>
        )}

        <h3
          className={[
            titleSizeBySize[size],
            !icon && !eyebrow ? "mt-auto" : "",
            "font-medium leading-[1.12] tracking-[-0.03em] text-balance",
            dark ? "text-white" : "text-neutral-900",
          ].join(" ")}
        >
          {title}
        </h3>

        {subtitle && (
          <p
            className={[
              "text-[15px] leading-[1.6] max-w-lg text-pretty",
              dark ? "text-neutral-400" : "text-neutral-600",
            ].join(" ")}
          >
            {subtitle}
          </p>
        )}

        {children}
        {actions && <div className="pt-4 flex items-center gap-2">{actions}</div>}
      </div>
    </CardShell>
  );
}
