"use client";

import React, { useState, useRef, useCallback } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "outline";
type ButtonSize = "sm" | "md" | "lg" | "icon";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
  fullWidth?: boolean;
  /** Surface the button sits on. On dark cards, secondary/outline switch to a
      dark face so they don't glare against the card. */
  tone?: "light" | "dark";
  /** Equal width and height, for icon-only layered buttons. */
  square?: boolean;
}

/* Layered buttons are a raised face seated in a machined bezel. The bezel
   never moves; the face lifts on hover and sinks flush when pressed.      */
const shellConfig: Record<
  string,
  {
    bezel: string;
    bezelShadow: string;
    face: string;
    faceShadow: string;
    faceHoverShadow: string;
    facePressedShadow: string;
    text: string;
    textShadow: string;
    fill: string;
  }
> = {
  primary: {
    bezel: "var(--bezel-inverse)",
    bezelShadow: "var(--bezel-inverse-shadow)",
    face: "var(--face-inverse)",
    faceShadow: "var(--face-inverse-shadow)",
    faceHoverShadow: "var(--face-inverse-shadow-hover)",
    facePressedShadow: "var(--face-inverse-pressed)",
    text: "text-ink-inverse",
    textShadow: "var(--emboss-inverse-deep)",
    fill: "bg-ink-inverse/[0.05]",
  },
  secondary: {
    bezel: "var(--bezel)",
    bezelShadow: "var(--bezel-shadow)",
    face: "var(--face)",
    faceShadow: "var(--face-shadow)",
    faceHoverShadow: "var(--face-shadow-hover)",
    facePressedShadow: "var(--face-pressed)",
    text: "text-ink-soft",
    textShadow: "var(--emboss)",
    fill: "bg-ink/[0.025]",
  },
  outline: {
    bezel: "var(--outline-bezel)",
    bezelShadow: "var(--outline-bezel-shadow)",
    face: "var(--face)",
    faceShadow: "var(--outline-face-shadow)",
    faceHoverShadow: "var(--outline-face-shadow-hover)",
    facePressedShadow: "var(--face-pressed)",
    text: "text-ink-label",
    textShadow: "var(--emboss)",
    fill: "bg-ink/[0.025]",
  },
};

/* Secondary on a dark surface: a raised face a few steps lighter than the
   card — present, but in the same family of tones. It's the mid material,
   the same one secondary keys wear everywhere in the dark theme.        */
const darkSecondary = {
  bezel: "var(--bezel-mid)",
  bezelShadow: "var(--bezel-mid-shadow)",
  face: "var(--face-mid)",
  faceShadow: "var(--face-mid-shadow)",
  faceHoverShadow: "var(--face-mid-shadow-hover)",
  facePressedShadow: "var(--face-dark-pressed)",
  text: "text-neutral-100",
  textShadow: "var(--emboss-inverse)",
  fill: "bg-white/[0.04]",
};

/* Flat buttons (ghost, icon) are a single face without a bezel. */
const flatConfig: Record<
  ButtonVariant,
  {
    bg: string;
    background?: string;
    fill: string;
    shadow: string;
    hoverShadow: string;
    pressedShadow: string;
  }
> = {
  primary: {
    bg: "text-ink-inverse",
    background: "var(--face-inverse)",
    fill: "bg-ink-inverse/[0.08]",
    shadow: "var(--face-inverse-shadow)",
    hoverShadow: "var(--face-inverse-float-shadow)",
    pressedShadow: "var(--face-inverse-pressed)",
  },
  secondary: {
    bg: "text-ink-soft",
    background: "var(--face)",
    fill: "bg-ink/[0.035]",
    shadow: "var(--face-shadow)",
    hoverShadow: "var(--face-float-shadow)",
    pressedShadow: "var(--face-pressed)",
  },
  ghost: {
    bg: "bg-transparent text-ink-muted hover:text-ink-soft",
    fill: "bg-ink/[0.05]",
    shadow: "none",
    hoverShadow: "var(--ghost-shadow-hover)",
    pressedShadow: "var(--ghost-shadow-pressed)",
  },
  outline: {
    bg: "bg-transparent text-ink-label",
    fill: "bg-ink/[0.035]",
    shadow: "var(--outline-shadow)",
    hoverShadow: "var(--outline-shadow-hover)",
    pressedShadow: "var(--outline-shadow-pressed)",
  },
};

/* Bezel radius minus bezel padding = face radius, so the curves stay concentric. */
const shellRadius: Record<ButtonSize, string> = {
  sm: "rounded-[12px] p-[3px]",
  md: "rounded-[13px] p-[3px]",
  lg: "rounded-[15px] p-[3.5px]",
  icon: "",
};

const faceRadius: Record<ButtonSize, string> = {
  sm: "rounded-[9px]",
  md: "rounded-[10px]",
  lg: "rounded-[11.5px]",
  icon: "",
};

const innerPadding: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-[13px]",
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3 text-[15px]",
  icon: "w-7 h-7 p-0 text-[13px]",
};

const squarePadding: Record<ButtonSize, string> = {
  sm: "w-9 h-9 p-0 text-[13px]",
  md: "w-10 h-10 p-0 text-sm",
  lg: "w-12 h-12 p-0 text-[15px]",
  icon: "",
};

const flatSizeStyles: Record<ButtonSize, string> = {
  sm: "px-4 py-2.5 text-[13px] rounded-[10px]",
  md: "px-5 py-3 text-sm rounded-[10px]",
  lg: "px-7 py-3.5 text-[15px] rounded-xl",
  icon: "w-8 h-8 p-0 rounded-[10px] text-[13px]",
};

export function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  tone = "light",
  square = false,
  className = "",
  children,
  disabled,
  onClick,
  onPointerDown,
  onPointerUp,
  onPointerLeave,
  onPointerCancel,
  onPointerEnter,
  style,
  ...rest
}: ButtonProps) {
  const [pressed, setPressed] = useState(false);
  const [hovered, setHovered] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* The press state is the button's own; handlers passed in run alongside
     it rather than replacing it                                        */
  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLButtonElement>) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      setPressed(true);
      onPointerDown?.(e);
    },
    [onPointerDown],
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent<HTMLButtonElement>) => {
      timerRef.current = setTimeout(() => setPressed(false), 150);
      onPointerUp?.(e);
    },
    [onPointerUp],
  );

  const handlePointerCancel = useCallback(
    (e: React.PointerEvent<HTMLButtonElement>) => {
      timerRef.current = setTimeout(() => setPressed(false), 150);
      onPointerCancel?.(e);
    },
    [onPointerCancel],
  );

  const handlePointerLeave = useCallback(
    (e: React.PointerEvent<HTMLButtonElement>) => {
      setHovered(false);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setPressed(false), 150);
      onPointerLeave?.(e);
    },
    [onPointerLeave],
  );

  const layered = variant !== "ghost" && size !== "icon";

  const handlers = {
    onClick,
    onPointerDown: handlePointerDown,
    onPointerUp: handlePointerUp,
    onPointerLeave: handlePointerLeave,
    onPointerCancel: handlePointerCancel,
    onPointerEnter: (e: React.PointerEvent<HTMLButtonElement>) => {
      setHovered(true);
      onPointerEnter?.(e);
    },
  };

  if (layered) {
    const cfg =
      tone === "dark" && (variant === "secondary" || variant === "outline")
        ? darkSecondary
        : shellConfig[variant];
    const faceShadow = pressed
      ? cfg.facePressedShadow
      : hovered
        ? cfg.faceHoverShadow
        : cfg.faceShadow;

    return (
      <button
        data-btn
        className={[
          "group/btn relative inline-flex cursor-pointer select-none whitespace-nowrap",
          shellRadius[size],
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink",
          "disabled:opacity-40 disabled:pointer-events-none",
          fullWidth ? "w-full" : "",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        style={{
          background: cfg.bezel,
          boxShadow: cfg.bezelShadow,
          ...style,
        }}
        disabled={disabled}
        {...handlers}
        {...rest}
      >
        <span
          className={[
            "btn-face relative overflow-hidden flex items-center justify-center gap-1.5 font-medium",
            faceRadius[size],
            cfg.text,
            square ? squarePadding[size] : ["w-full", innerPadding[size]].join(" "),
          ].join(" ")}
          style={{
            background: cfg.face,
            boxShadow: faceShadow,
            textShadow: cfg.textShadow,
            transform: pressed
              ? "translateY(0.5px) scale(0.985)"
              : hovered
                ? "translateY(-0.5px)"
                : "none",
            transition:
              "transform 240ms var(--ease-spring), box-shadow 200ms ease-out",
          }}
        >
          <span
            aria-hidden="true"
            className={[
              "pointer-events-none absolute inset-0 origin-bottom transition-transform duration-300 ease-out",
              pressed
                ? "scale-y-100"
                : "scale-y-0 group-hover/btn:scale-y-100",
              cfg.fill,
            ].join(" ")}
          />
          <span className="btn-icon-nudge relative z-10 inline-flex items-center gap-1.5">
            {children}
          </span>
        </span>
      </button>
    );
  }

  const cfg = flatConfig[variant];
  const currentShadow = pressed
    ? cfg.pressedShadow
    : hovered
      ? cfg.hoverShadow
      : cfg.shadow;

  return (
    <button
      data-btn
      className={[
        "btn-face group/btn relative overflow-hidden inline-flex items-center justify-center gap-1.5 font-medium cursor-pointer select-none whitespace-nowrap",
        "transition-colors duration-200 ease-out",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink",
        "disabled:opacity-40 disabled:pointer-events-none",
        cfg.bg,
        flatSizeStyles[size],
        fullWidth ? "w-full" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={{
        background: cfg.background,
        boxShadow: currentShadow,
        transform: pressed
          ? "translateY(0.5px) scale(0.97)"
          : hovered && cfg.background
            ? "translateY(-0.5px)"
            : "none",
        transition:
          "transform 240ms var(--ease-spring), box-shadow 200ms ease-out, color 200ms ease-out",
        ...style,
      }}
      disabled={disabled}
      {...handlers}
      {...rest}
    >
      <span
        aria-hidden="true"
        className={[
          "pointer-events-none absolute inset-0 origin-bottom transition-transform duration-300 ease-out",
          pressed ? "scale-y-100" : "scale-y-0 group-hover/btn:scale-y-100",
          cfg.fill,
        ].join(" ")}
      />
      <span className="relative z-10 inline-flex items-center gap-1.5">
        {children}
      </span>
    </button>
  );
}
