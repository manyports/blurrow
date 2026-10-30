"use client";

import React from "react";

interface CloseButtonProps {
  onClick?: () => void;
  label?: string;
  size?: "sm" | "md";
  tone?: "light" | "dark";
  className?: string;
}

const sizes = {
  sm: { box: "w-6 h-6 rounded-[7px]", icon: 9 },
  md: { box: "w-7 h-7 rounded-[8px]", icon: 10 },
};

/* Quiet until hovered, then it rises into a raised face like every other
   pressable thing — so it reads as a control, not decoration.            */
export function CloseButton({
  onClick,
  label = "Close",
  size = "md",
  tone = "light",
  className = "",
}: CloseButtonProps) {
  const dark = tone === "dark";
  const s = sizes[size];

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={[
        "group/close relative shrink-0 flex items-center justify-center cursor-pointer",
        "transition-[color,background,scale] duration-150 active:scale-95",
        "focus-visible:outline-2 focus-visible:outline-offset-2",
        dark
          ? "text-white/45 hover:text-white focus-visible:outline-white"
          : "text-neutral-400 hover:text-neutral-900 focus-visible:outline-neutral-900",
        s.box,
        className,
      ].join(" ")}
    >
      <span
        aria-hidden
        className={[
          "absolute inset-0 rounded-[inherit] opacity-0 group-hover/close:opacity-100 transition-opacity duration-150",
          dark
            ? "[background:var(--tile-dark)] [box-shadow:var(--tile-dark-shadow)]"
            : "[background:var(--face-light)] [box-shadow:var(--face-light-shadow)]",
        ].join(" ")}
      />
      <svg
        className="relative"
        width={s.icon}
        height={s.icon}
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  );
}
