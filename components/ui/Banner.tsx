"use client";

import { ReactNode } from "react";
import { CloseButton } from "./CloseButton";

type BannerVariant = "default" | "accent" | "warning";

/* A banner is a dark bezel holding a dark face — the same build as the
   primary button, stretched to full width. On a dark page it stays a
   dark strip (the mid material) rather than a full-width pale bar.    */
const variantStyles: Record<
  BannerVariant,
  { bezel: string; bezelShadow: string; face: string; faceShadow: string; text: string; tone: "light" | "dark" }
> = {
  default: {
    bezel: "var(--banner-bezel)",
    bezelShadow: "var(--banner-bezel-shadow)",
    face: "var(--banner-face)",
    faceShadow: "var(--banner-face-shadow)",
    text: "text-white",
    tone: "dark",
  },
  accent: {
    bezel: "var(--bezel-violet)",
    bezelShadow: "var(--bezel-violet-shadow)",
    face: "var(--face-violet)",
    faceShadow: "var(--face-violet-shadow)",
    text: "text-white",
    tone: "dark",
  },
  warning: {
    bezel: "var(--bezel-warning)",
    bezelShadow: "var(--bezel-warning-shadow)",
    face: "var(--face-warning)",
    faceShadow: "var(--face-warning-shadow)",
    text: "text-warning-ink",
    tone: "light",
  },
};

export function Banner({
  variant = "default",
  children,
  icon,
  dismissible = false,
  onDismiss,
  action,
  className = "",
}: {
  variant?: BannerVariant;
  children: ReactNode;
  icon?: ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
  action?: ReactNode;
  className?: string;
}) {
  const s = variantStyles[variant];

  return (
    <div
      role="region"
      aria-label="Announcement"
      className={`w-full rounded-[18px] p-1 ${className}`}
      style={{ background: s.bezel, boxShadow: s.bezelShadow }}
    >
      <div
        className={`rounded-[14px] pl-4 pr-2 py-2.5 flex items-center gap-3 ${s.text}`}
        style={{ background: s.face, boxShadow: s.faceShadow }}
      >
        {icon && <span aria-hidden className="flex-shrink-0 opacity-80">{icon}</span>}

        {/* Left-aligned so it reads in one sweep with the icon beside it */}
        <span className="text-[13px] font-medium flex-1 min-w-0 leading-relaxed">
          {children}
        </span>

        {action && <span className="flex-shrink-0">{action}</span>}

        {dismissible && (
          <CloseButton size="sm" tone={s.tone} label="Dismiss announcement" onClick={onDismiss} />
        )}
      </div>
    </div>
  );
}
