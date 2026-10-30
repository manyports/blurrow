"use client";

import React, { useState, useId } from "react";

interface CheckboxProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  indeterminate?: boolean;
  className?: string;
}

export function Checkbox({
  checked,
  defaultChecked = false,
  onChange,
  label,
  description,
  disabled = false,
  indeterminate = false,
  className = "",
}: CheckboxProps) {
  const [internal, setInternal] = useState(defaultChecked);
  const uid = useId();
  const isChecked = checked !== undefined ? checked : internal;

  const toggle = () => {
    if (disabled) return;
    const next = !isChecked;
    setInternal(next);
    onChange?.(next);
  };

  const active = isChecked || indeterminate;

  return (
    <div
      className={[
        "flex items-center justify-between gap-4 select-none",
        disabled ? "opacity-40 pointer-events-none" : "cursor-pointer",
        className,
      ].join(" ")}
      onClick={toggle}
    >
      {(label || description) && (
        <div className="flex flex-col gap-0.5 min-w-0">
          {label && (
            <span id={`${uid}-label`} className="text-[13px] font-medium text-neutral-900 leading-snug">{label}</span>
          )}
          {description && (
            <span id={`${uid}-desc`} className="text-[12px] text-neutral-500 leading-relaxed">{description}</span>
          )}
        </div>
      )}

      {/* Clicks bubble to the row, so the control itself has no onClick */}
      <button
        type="button"
        role="checkbox"
        aria-checked={indeterminate ? "mixed" : isChecked}
        aria-labelledby={label ? `${uid}-label` : undefined}
        aria-describedby={description ? `${uid}-desc` : undefined}
        disabled={disabled}
        className={[
          "shrink-0 w-[22px] h-[22px] rounded-[7px] flex items-center justify-center cursor-pointer",
          "transition-[box-shadow,transform,scale] duration-200 ease-out active:scale-90",
        ].join(" ")}
        style={{
          background: active ? "var(--face-dark)" : "var(--field)",
          boxShadow: active ? "var(--face-dark-shadow)" : "var(--field-shadow)",
        }}
      >
        {active && (
          indeterminate ? (
            <span className="animate-checkbox-in">
              <svg width="10" height="2" viewBox="0 0 10 2" fill="none">
                <rect width="10" height="2" rx="1" fill="white" />
              </svg>
            </span>
          ) : (
            <svg width="13" height="10" viewBox="0 0 13 10" fill="none">
              <path
                d="M1.5 5l3.5 3.5L11.5 1"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="animate-draw-check"
              />
            </svg>
          )
        )}
      </button>
    </div>
  );
}
