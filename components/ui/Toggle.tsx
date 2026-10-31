"use client";

import React, { useId, useState } from "react";

interface ToggleProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
}

export function Toggle({
  checked,
  defaultChecked = false,
  onChange,
  label,
  description,
  disabled = false,
}: ToggleProps) {
  const [internal, setInternal] = useState(defaultChecked);
  const [pressed, setPressed] = useState(false);
  const uid = useId();
  const isOn = checked !== undefined ? checked : internal;

  const toggle = () => {
    if (disabled) return;
    const next = !isOn;
    setInternal(next);
    onChange?.(next);
  };

  return (
    <div
      className={[
        "flex items-center justify-between gap-4 select-none",
        disabled ? "opacity-35 pointer-events-none" : "cursor-pointer",
      ].join(" ")}
      onClick={toggle}
    >
      {(label || description) && (
        <div className="flex flex-col gap-0.5 min-w-0">
          {label && (
            <span id={`${uid}-label`} className="text-[13px] font-medium text-ink leading-snug">
              {label}
            </span>
          )}
          {description && (
            <span id={`${uid}-desc`} className="text-[12px] text-ink-muted leading-relaxed">
              {description}
            </span>
          )}
        </div>
      )}

      {/* Clicks bubble to the row, so the switch itself has no onClick */}
      <button
        type="button"
        role="switch"
        aria-checked={isOn}
        aria-labelledby={label ? `${uid}-label` : undefined}
        aria-describedby={description ? `${uid}-desc` : undefined}
        disabled={disabled}
        onPointerDown={() => setPressed(true)}
        onPointerUp={() => setPressed(false)}
        onPointerLeave={() => setPressed(false)}
        className={[
          "relative shrink-0 w-[46px] h-[26px] rounded-[13px] cursor-pointer",
          "transition-[background-color,box-shadow] duration-200 ease-out",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink",
          isOn ? "bg-track-on" : "bg-track",
        ].join(" ")}
        style={{
          /* The track is a recessed channel; the knob is a raised face inside it */
          boxShadow: isOn ? "var(--track-on-shadow)" : "var(--track-shadow)",
        }}
      >
        <span
          aria-hidden
          className="absolute top-1/2 h-5 rounded-[10px]"
          style={{
            left: 3,
            /* The knob stretches while held, like a finger dragging it */
            width: pressed ? 24 : 20,
            background: "var(--face)",
            boxShadow: "var(--knob-shadow)",
            transform: `translateX(${isOn ? (pressed ? 16 : 20) : 0}px) translateY(-50%)`,
            transition:
              "transform 260ms var(--ease-spring), width 200ms var(--ease-out-soft)",
          }}
        />
      </button>
    </div>
  );
}
