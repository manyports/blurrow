import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  fullWidth?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
}

/* Fields are sunken wells (see --field tokens in globals.css). Raised
   means "press me", sunken means "fill me" — that is the whole system. */

export function Input({
  label,
  hint,
  error,
  fullWidth = false,
  iconLeft,
  iconRight,
  className = "",
  id,
  ...rest
}: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
  const messageId = inputId && (error || hint) ? `${inputId}-message` : undefined;

  return (
    <div className={["group/field flex flex-col gap-1.5", fullWidth ? "w-full" : ""].join(" ")}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-[12.5px] font-medium text-neutral-700 tracking-[-0.005em] transition-colors duration-200 group-focus-within/field:text-neutral-950"
        >
          {label}
        </label>
      )}
      <div className="relative group/input isolate">
        {iconLeft && (
          <span
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 transition-all duration-300 ease-[cubic-bezier(0.34,1.4,0.64,1)] group-focus-within/input:text-neutral-800 group-focus-within/input:scale-110 pointer-events-none z-20 flex items-center justify-center"
          >
            {iconLeft}
          </span>
        )}
        <input
          id={inputId}
          className={[
            "field relative z-10 w-full rounded-xl py-3 text-[13.5px] text-neutral-900 caret-neutral-900",
            "placeholder:text-neutral-400 placeholder:transition-colors placeholder:duration-200 focus:placeholder:text-neutral-300",
            "disabled:opacity-40 disabled:cursor-not-allowed",
            iconLeft ? "pl-10" : "pl-4",
            iconRight ? "pr-10" : "pr-4",
            className,
          ]
            .filter(Boolean)
            .join(" ")}
          aria-invalid={error ? true : undefined}
          aria-describedby={messageId}
          {...rest}
        />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 z-15 rounded-xl overflow-hidden"
        >
          <span
            className="block absolute inset-y-0 w-[30%] -left-[30%] opacity-0 group-focus-within/input:animate-input-shimmer"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.55) 50%, transparent 100%)",
            }}
          />
        </span>
        {iconRight && (
          <span
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 transition-all duration-300 ease-[cubic-bezier(0.34,1.4,0.64,1)] group-focus-within/input:text-neutral-800 group-focus-within/input:scale-110 pointer-events-none z-20 flex items-center justify-center"
          >
            {iconRight}
          </span>
        )}
      </div>
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
