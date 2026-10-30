import React from "react";
import { CloseButton } from "./CloseButton";

type AlertVariant = "default" | "success" | "warning" | "error";

interface AlertProps {
  variant?: AlertVariant;
  title: string;
  description?: string;
  onDismiss?: () => void;
  className?: string;
}

/* Tiles share Toast's lit-from-above gradients, so an alert and the toast
   it came from look like the same object.                              */
const variantConfig: Record<AlertVariant, {
  tile: string;
  icon: React.ReactNode;
}> = {
  default: {
    tile: "var(--face-dark)",
    icon: (
      <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" />
        <path strokeLinecap="round" d="M12 8v4m0 4h.01" />
      </svg>
    ),
  },
  success: {
    tile: "linear-gradient(180deg, #10b981 0%, #059669 100%)",
    icon: (
      <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    ),
  },
  warning: {
    tile: "linear-gradient(180deg, #fbbf24 0%, #f59e0b 100%)",
    icon: (
      <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      </svg>
    ),
  },
  error: {
    tile: "linear-gradient(180deg, #f87171 0%, #dc2626 100%)",
    icon: (
      <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
  },
};

export function Alert({ variant = "default", title, description, onDismiss, className = "" }: AlertProps) {
  const { tile, icon } = variantConfig[variant];

  return (
    <div
      // Errors and warnings interrupt; everything else waits its turn
      role={variant === "error" || variant === "warning" ? "alert" : "status"}
      className={["rounded-[18px] p-1.5", className].join(" ")}
      style={{ background: "var(--panel-bezel)", boxShadow: "var(--panel-shadow)" }}
    >
      <div
        className="bg-white rounded-[13px] pl-3 pr-2 py-3 flex items-start gap-3"
        style={{ boxShadow: "var(--panel-face-shadow)" }}
      >
        <div
          aria-hidden
          className="shrink-0 w-7 h-7 rounded-[8px] flex items-center justify-center text-white"
          style={{
            background: tile,
            boxShadow:
              "0 0 3px rgba(0,0,0,0.212), 0 1px 2px rgba(0,0,0,0.15), inset 0 2px 3px -2px rgba(255,255,255,0.188)",
          }}
        >
          {icon}
        </div>

        <div className="flex-1 min-w-0 pt-[5px]">
          <p className="text-[13px] font-semibold text-neutral-900 leading-tight tracking-[-0.01em]">{title}</p>
          {description && (
            <p className="text-[12.5px] text-neutral-500 mt-1 leading-relaxed">{description}</p>
          )}
        </div>

        {onDismiss && <CloseButton size="sm" label="Dismiss" onClick={onDismiss} />}
      </div>
    </div>
  );
}
