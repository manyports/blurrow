"use client";

import React from "react";

/* The label above a field and the line under it, shared by every form
   control so they read as one family.                                */

export function FieldLabel({
  id,
  htmlFor,
  children,
}: {
  id?: string;
  htmlFor?: string;
  children: React.ReactNode;
}) {
  const className =
    "text-[12.5px] font-medium text-ink-label tracking-[-0.005em] transition-colors duration-200 group-focus-within/field:text-ink-strong";
  return htmlFor ? (
    <label id={id} htmlFor={htmlFor} className={className}>
      {children}
    </label>
  ) : (
    <span id={id} className={className}>
      {children}
    </span>
  );
}

/* An error wins over a hint; either is announced through `id` */
export function FieldMessage({ id, error, hint }: { id?: string; error?: string; hint?: string }) {
  if (error) {
    return (
      <p id={id} role="alert" className="text-[11.5px] text-danger font-medium flex items-center gap-1 mt-0.5">
        <svg aria-hidden width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" />
          <path strokeLinecap="round" d="M12 8v4m0 4h.01" />
        </svg>
        {error}
      </p>
    );
  }
  if (hint) {
    return (
      <p id={id} className="text-[11.5px] text-ink-muted mt-0.5">
        {hint}
      </p>
    );
  }
  return null;
}

/* A small raised key that sits inside a field or a panel: steppers,
   month arrows, clear buttons. It sinks flush while held.            */
export function FieldKey({
  label,
  disabled,
  onClick,
  onPress,
  onRelease,
  focusable = true,
  size = 28,
  children,
}: {
  label: string;
  disabled?: boolean;
  onClick?: () => void;
  /** Pointer went down (for hold-to-repeat) */
  onPress?: () => void;
  onRelease?: () => void;
  focusable?: boolean;
  size?: number;
  children: React.ReactNode;
}) {
  const [pressed, setPressed] = React.useState(false);
  const release = () => {
    setPressed(false);
    onRelease?.();
  };
  return (
    <button
      type="button"
      aria-label={label}
      tabIndex={focusable ? undefined : -1}
      disabled={disabled}
      onClick={onClick}
      onPointerDown={(e) => {
        if (e.button !== 0) return;
        if (!focusable) e.preventDefault(); // keep focus in the field
        setPressed(true);
        onPress?.();
      }}
      onPointerUp={release}
      onPointerLeave={() => pressed && release()}
      onPointerCancel={release}
      className="grid shrink-0 cursor-pointer place-items-center rounded-[9px] text-ink-muted transition-[box-shadow,color,opacity] duration-150 hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ink disabled:opacity-35 disabled:pointer-events-none"
      style={{
        width: size,
        height: size,
        background: "var(--face)",
        boxShadow: pressed ? "var(--face-pressed)" : "var(--key-shadow)",
      }}
    >
      <svg
        aria-hidden
        width="12"
        height="12"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
        viewBox="0 0 24 24"
        style={{
          transform: pressed ? "translateY(0.5px) scale(0.92)" : "none",
          transition: "transform 150ms var(--ease-spring)",
        }}
      >
        {children}
      </svg>
    </button>
  );
}
