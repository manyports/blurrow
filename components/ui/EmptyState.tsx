import React from "react";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={["rounded-[20px] p-1.5", className].filter(Boolean).join(" ")}
      style={{ background: "var(--panel-bezel)", boxShadow: "var(--panel-shadow)" }}
    >
      <div
        className="relative bg-panel-face rounded-[15px] overflow-hidden flex flex-col items-center justify-center text-center py-14 px-6"
        style={{ boxShadow: "var(--panel-face-shadow)" }}
      >
        {/* A faint dotted floor: the space is empty, not broken */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(var(--dots) 1px, transparent 1px)",
            backgroundSize: "14px 14px",
            maskImage: "radial-gradient(60% 70% at 50% 40%, black 0%, transparent 100%)",
            WebkitMaskImage: "radial-gradient(60% 70% at 50% 40%, black 0%, transparent 100%)",
          }}
        />
        {icon && (
          <div
            aria-hidden
            className="relative w-12 h-12 rounded-[14px] flex items-center justify-center text-ink-muted mb-5"
            style={{ background: "var(--face)", boxShadow: "var(--face-shadow), var(--face-drop)" }}
          >
            {icon}
          </div>
        )}
        <p className="relative text-[15px] font-semibold text-ink tracking-[-0.015em]">{title}</p>
        {description && (
          <p className="relative text-[13px] text-ink-muted mt-1.5 max-w-xs leading-relaxed">{description}</p>
        )}
        {action && <div className="relative mt-6">{action}</div>}
      </div>
    </div>
  );
}
