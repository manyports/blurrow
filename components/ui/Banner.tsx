"use client";

import { ReactNode } from "react";
import { CloseButton } from "./CloseButton";

type BannerVariant = "default" | "accent" | "warning";

/* A banner is a dark bezel holding a dark face — the same build as the
   primary button, stretched to full width.                            */
const variantStyles: Record<
  BannerVariant,
  { bezel: string; bezelShadow: string; face: string; faceShadow: string; text: string; tone: "light" | "dark" }
> = {
  default: {
    bezel: "var(--bezel-dark)",
    bezelShadow: "var(--bezel-dark-shadow)",
    face: "var(--face-dark)",
    faceShadow: "var(--face-dark-shadow)",
    text: "text-white",
    tone: "dark",
  },
  accent: {
    bezel: "linear-gradient(180deg, #4c2a99 0%, #2e1065 100%)",
    bezelShadow:
      "0 0 0 0.5px rgba(46,16,101,0.36), 0 4px 12px -4px rgba(76,29,149,0.45), inset 0 2px 3px -2px rgba(255,255,255,0.09)",
    face: "linear-gradient(180deg, #7c3aed 0%, #6d28d9 100%)",
    faceShadow:
      "0 0 3px rgba(46,16,101,0.35), 0 1px 2px rgba(46,16,101,0.4), inset 0 2px 3px -2px rgba(255,255,255,0.165)",
    text: "text-white",
    tone: "dark",
  },
  warning: {
    bezel: "linear-gradient(180deg, #fde68a 0%, #f5c84b 100%)",
    bezelShadow:
      "0 0 0 0.5px rgba(180,83,9,0.15), 0 4px 12px -4px rgba(217,119,6,0.3), inset 0 2px 3px -2px rgba(255,255,255,0.45)",
    face: "linear-gradient(180deg, #fffbeb 0%, #fef3c7 100%)",
    faceShadow:
      "0 0 3px rgba(180,83,9,0.255), 0 1px 2px rgba(180,83,9,0.12), inset 0 2px 3px -2px rgba(255,255,255,1)",
    text: "text-amber-900",
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
