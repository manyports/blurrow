"use client";

import React, { useId, useRef, useState } from "react";
import { FieldLabel, FieldMessage } from "./FieldMessage";

interface OtpInputProps {
  /** How many characters */
  length?: number;
  value?: string;
  defaultValue?: string;
  onChange?: (code: string) => void;
  /** Fires once every cell is filled, with the whole code */
  onComplete?: (code: string) => void;
  /** Digits only, or letters and digits */
  type?: "numeric" | "alphanumeric";
  /** Split the cells into wells of this many, like 123 456 */
  groupSize?: number;
  /** Show dots instead of the characters */
  mask?: boolean;
  label?: string;
  hint?: string;
  error?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  name?: string;
}

const CELL = 44;

/* One real input sits underneath, so typing, backspace, paste and the
   phone filling the code from a text all behave natively. What you see
   is drawn over it: each group is a single sunken field, cut into cells
   by scored grooves, that lifts flush and draws its border while you're
   in it, exactly like Input. A caret glides from cell to cell on a
   spring as you type, and characters press into place.             */
export function OtpInput({
  length = 6,
  value,
  defaultValue = "",
  onChange,
  onComplete,
  type = "numeric",
  groupSize,
  mask = false,
  label,
  hint,
  error,
  disabled = false,
  autoFocus = false,
  name,
}: OtpInputProps) {
  const uid = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [internal, setInternal] = useState(defaultValue.slice(0, length));
  const code = (value !== undefined ? value : internal).slice(0, length);
  const [focused, setFocused] = useState(false);
  // The cell the caret is in: the selection start, kept within the code
  const [cursor, setCursor] = useState(0);
  const messageId = error || hint ? `${uid}-message` : undefined;
  const at = Math.min(cursor, code.length, length - 1);

  const pattern = type === "numeric" ? /[^0-9]/g : /[^0-9a-z]/gi;

  /* A filled cell is selected rather than sitting behind a caret, so
     typing over it replaces it in place                              */
  const selectCell = (i: number) => {
    const el = inputRef.current;
    if (!el) return;
    const n = el.value.length;
    const pos = Math.max(0, Math.min(i, n));
    el.setSelectionRange(pos, pos < n ? pos + 1 : pos);
    setCursor(pos);
  };

  const groups = groupSize && groupSize < length ? Math.ceil(length / groupSize) : 1;
  const per = groups > 1 ? groupSize! : length;

  return (
    <div className="group/field flex flex-col gap-1.5">
      {label && (
        <FieldLabel id={`${uid}-label`} htmlFor={`${uid}-input`}>
          {label}
        </FieldLabel>
      )}

      <div
        className={["relative flex w-fit items-center gap-3", disabled ? "opacity-40" : ""].join(" ")}
      >
        <input
          ref={inputRef}
          id={`${uid}-input`}
          type={mask ? "password" : "text"}
          inputMode={type === "numeric" ? "numeric" : "text"}
          autoComplete="one-time-code"
          autoCapitalize="characters"
          autoFocus={autoFocus}
          spellCheck={false}
          maxLength={length}
          disabled={disabled}
          value={code}
          aria-invalid={error ? true : undefined}
          aria-describedby={messageId}
          aria-label={label ? undefined : `${length}-character code`}
          // The input lies over the cells; send the caret to whichever was clicked
          onClick={(e) => {
            const cell = document
              .elementsFromPoint(e.clientX, e.clientY)
              .find((el): el is HTMLElement => el instanceof HTMLElement && el.dataset.cell !== undefined);
            selectCell(cell ? Number(cell.dataset.cell) : code.length);
          }}
          onFocus={() => {
            setFocused(true);
            requestAnimationFrame(() => selectCell(code.length));
          }}
          onBlur={() => setFocused(false)}
          onChange={(e) => {
            const next = e.target.value.replace(pattern, "").toUpperCase().slice(0, length);
            setInternal(next);
            onChange?.(next);
            if (next.length === length && next !== code) onComplete?.(next);
            const pos = Math.min(e.target.selectionStart ?? next.length, next.length);
            requestAnimationFrame(() => selectCell(pos));
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
              e.preventDefault();
              selectCell(at + (e.key === "ArrowLeft" ? -1 : 1));
            } else if (e.key === "Home" || e.key === "End") {
              e.preventDefault();
              selectCell(e.key === "Home" ? 0 : code.length);
            }
          }}
          onSelect={(e) => {
            const el = e.currentTarget;
            setCursor(Math.min(el.selectionStart ?? 0, length - 1));
          }}
          // Invisible, but it's what a tap lands on, so phones raise their keyboard
          className="absolute inset-0 z-30 h-full w-full cursor-text opacity-0 disabled:cursor-not-allowed"
          style={{ fontSize: 16 /* stops iOS zooming in on focus */ }}
        />

        {Array.from({ length: groups }, (_, g) => {
          const start = g * per;
          const cells = Math.min(per, length - start);
          const caretHere = focused && at >= start && at < start + cells;
          return (
            <React.Fragment key={g}>
              {g > 0 && (
                <span
                  aria-hidden
                  className="h-[2px] w-2.5 shrink-0 rounded-full"
                  style={{ background: "var(--groove)", boxShadow: "var(--groove-lip-below)" }}
                />
              )}
              {/* One field per group: data-open gives it the focused well */}
              <div
                aria-hidden
                data-open={caretHere || undefined}
                data-invalid={error ? true : undefined}
                className="field relative z-10 flex h-[52px] overflow-hidden rounded-xl"
              >
                {Array.from({ length: cells }, (_, k) => {
                  const i = start + k;
                  const ch = code[i];
                  return (
                    <div key={i} data-cell={i} className="relative grid place-items-center" style={{ width: CELL }}>
                      {k > 0 && (
                        <span
                          className="absolute inset-y-3 left-0 w-px"
                          style={{ background: "var(--groove)", boxShadow: "var(--groove-lip)" }}
                        />
                      )}
                      {ch &&
                        (mask ? (
                          <span key={ch + i} className="animate-checkbox-in h-2.5 w-2.5 rounded-full bg-ink" />
                        ) : (
                          <span key={ch + i} className="animate-checkbox-in text-[20px] font-semibold tabular-nums text-ink">
                            {ch}
                          </span>
                        ))}
                      {/* A filled cell under the caret is picked out, ready to be typed over */}
                      {caretHere && i === at && ch && (
                        <span className="absolute inset-x-1.5 bottom-2 h-[2px] rounded-full bg-ink animate-otp-caret" />
                      )}
                    </div>
                  );
                })}

                {/* The caret glides between the empty cells of this group */}
                {caretHere && !code[at] && (
                  <span
                    className="pointer-events-none absolute top-1/2 h-[22px] w-[2px] -translate-y-1/2"
                    style={{
                      left: (at - start) * CELL + CELL / 2 - 1,
                      transition: "left 260ms var(--ease-spring)",
                    }}
                  >
                    <span className="block h-full w-full animate-otp-caret rounded-full bg-ink" />
                  </span>
                )}

                {/* Input's sweep of light as the well comes up */}
                {caretHere && (
                  <span
                    className="pointer-events-none absolute inset-y-0 -left-[30%] block w-[30%] animate-input-shimmer"
                    style={{ background: "linear-gradient(90deg, transparent 0%, var(--shimmer) 50%, transparent 100%)" }}
                  />
                )}
              </div>
            </React.Fragment>
          );
        })}
      </div>

      {name && <input type="hidden" name={name} value={code} />}
      <FieldMessage id={messageId} error={error} hint={hint} />
    </div>
  );
}
