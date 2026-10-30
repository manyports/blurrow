"use client";

import React, { useRef, useCallback, useEffect } from "react";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
  error?: string;
  fullWidth?: boolean;
  autoResize?: boolean;
}

export function Textarea({
  label,
  hint,
  error,
  fullWidth = false,
  autoResize = false,
  className = "",
  id,
  rows = 3,
  onChange,
  ...rest
}: TextareaProps) {
  const textareaId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
  const messageId = textareaId && (error || hint) ? `${textareaId}-message` : undefined;
  const ref = useRef<HTMLTextAreaElement>(null);

  const resize = useCallback(() => {
    if (!autoResize || !ref.current) return;
    ref.current.style.height = "auto";
    ref.current.style.height = ref.current.scrollHeight + "px";
  }, [autoResize]);

  useEffect(() => { resize(); }, [resize]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    resize();
    onChange?.(e);
  };

  return (
    <div className={["group/field flex flex-col gap-1.5", fullWidth ? "w-full" : ""].join(" ")}>
      {label && (
        <label
          htmlFor={textareaId}
          className="text-[12.5px] font-medium text-neutral-700 tracking-[-0.005em] transition-colors duration-200 group-focus-within/field:text-neutral-950"
        >
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={textareaId}
        rows={rows}
        onChange={handleChange}
        className={[
          "field rounded-xl px-4 py-3 text-[13.5px] text-neutral-900 resize-none scroll-thin",
          "placeholder:text-neutral-400 placeholder:transition-colors placeholder:duration-200 focus:placeholder:text-neutral-300",
          "disabled:opacity-40 disabled:cursor-not-allowed",
          fullWidth ? "w-full" : "",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        aria-invalid={error ? true : undefined}
        aria-describedby={messageId}
        {...rest}
      />
      {error && (
        <p id={messageId} role="alert" className="text-[11.5px] text-red-600 font-medium flex items-center gap-1 mt-0.5">
          <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" />
            <path strokeLinecap="round" d="M12 8v4m0 4h.01" />
          </svg>
          {error}
        </p>
      )}
      {hint && !error && (
        <p id={messageId} className="text-[11.5px] text-neutral-500 mt-0.5">{hint}</p>
      )}
    </div>
  );
}
