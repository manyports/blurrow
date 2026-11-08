"use client";

import React, { useId, useRef, useState } from "react";
import { Portal } from "./Floating";
import { FieldLabel, FieldMessage } from "./FieldMessage";
import { useFloatingPanel } from "./useFloatingPanel";

/* ── Colour maths ─────────────────────────────────────────────────── */
type HSV = { h: number; s: number; v: number };

const clamp = (n: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, n));

/** Accepts #rgb, #rrggbb, with or without the hash. Returns #rrggbb or null */
export function normalizeHex(input: string): string | null {
  const s = input.trim().replace(/^#/, "").toLowerCase();
  if (/^[0-9a-f]{3}$/.test(s)) return "#" + s.split("").map((c) => c + c).join("");
  if (/^[0-9a-f]{6}$/.test(s)) return "#" + s;
  return null;
}

function hexToHsv(hex: string): HSV {
  const n = parseInt(hex.slice(1), 16);
  const r = ((n >> 16) & 255) / 255;
  const g = ((n >> 8) & 255) / 255;
  const b = (n & 255) / 255;
  const max = Math.max(r, g, b);
  const d = max - Math.min(r, g, b);
  let h = 0;
  if (d) {
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h = (h * 60 + 360) % 360;
  }
  return { h, s: max ? d / max : 0, v: max };
}

function hsvToHex({ h, s, v }: HSV): string {
  const f = (n: number) => {
    const k = (n + h / 60) % 6;
    return Math.round((v - v * s * Math.max(0, Math.min(k, 4 - k, 1))) * 255);
  };
  return "#" + [f(5), f(3), f(1)].map((x) => x.toString(16).padStart(2, "0")).join("");
}

const DEFAULT_SWATCHES = [
  "#171717", "#737373", "#dc2626", "#ea580c", "#ca8a04",
  "#16a34a", "#0891b2", "#2563eb", "#7c3aed", "#db2777",
];

/* ── The panel: area, hue strip, hex field, swatches ──────────────── */
interface ColorPanelProps {
  value: string;
  onChange: (hex: string) => void;
  swatches?: string[];
  /** Focus the saturation knob as soon as the panel mounts */
  autoFocus?: boolean;
}

function ColorPanel({ value, onChange, swatches = DEFAULT_SWATCHES, autoFocus = false }: ColorPanelProps) {
  // Hue and saturation are kept apart from the hex, so dragging through
  // grey or black doesn't forget which colour you were on
  const [hsv, setHsv] = useState<HSV>(() => hexToHsv(value));
  const [draft, setDraft] = useState(value);

  // A colour set from outside (not one we just sent up) resets the panel
  const [seen, setSeen] = useState(value);
  if (value !== seen) {
    setSeen(value);
    if (value !== hsvToHex(hsv)) {
      setHsv(hexToHsv(value));
      setDraft(value);
    }
  }

  const update = (next: HSV) => {
    setHsv(next);
    const hex = hsvToHex(next);
    setDraft(hex);
    if (hex !== value) onChange(hex);
  };

  const pickHex = (hex: string) => {
    setHsv(hexToHsv(hex));
    setDraft(hex);
    if (hex !== value) onChange(hex);
  };

  return (
    <div className="flex w-[236px] flex-col gap-3">
      <SaturationArea hsv={hsv} onChange={update} autoFocus={autoFocus} />
      <HueStrip hue={hsv.h} onChange={(h) => update({ ...hsv, h })} />

      <div className="flex items-center gap-2">
        <span
          aria-hidden
          className="h-9 w-9 shrink-0 rounded-[10px]"
          style={{ background: hsvToHex(hsv), boxShadow: "var(--tile-shadow), inset 0 0 0 1px var(--hairline)" }}
        />
        <div className="relative flex-1">
          <span className="pointer-events-none absolute left-3 top-1/2 z-20 -translate-y-1/2 text-[12.5px] text-ink-faint">#</span>
          <input
            aria-label="hex colour"
            value={draft.replace(/^#/, "")}
            maxLength={7}
            spellCheck={false}
            autoComplete="off"
            onChange={(e) => {
              setDraft("#" + e.target.value.replace(/^#/, ""));
              const hex = normalizeHex(e.target.value);
              if (hex && e.target.value.replace(/^#/, "").length === 6) pickHex(hex);
            }}
            onBlur={() => {
              const hex = normalizeHex(draft);
              if (hex) pickHex(hex);
              else setDraft(hsvToHex(hsv));
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                (e.target as HTMLInputElement).blur();
              }
            }}
            className="field relative z-10 w-full rounded-[10px] py-2 pl-6 pr-3 font-mono text-[12.5px] uppercase text-ink caret-ink"
          />
        </div>
      </div>

      {swatches.length > 0 && (
        <div role="group" aria-label="swatches" className="grid grid-cols-10 gap-1.5 border-t border-line-strong pt-3">
          {swatches.map((s) => {
            const hex = normalizeHex(s) ?? s;
            const on = hex === hsvToHex(hsv);
            return (
              <button
                key={s}
                type="button"
                aria-label={hex}
                aria-pressed={on}
                onClick={() => pickHex(hex)}
                className="relative aspect-square cursor-pointer rounded-full transition-transform duration-200 ease-[var(--ease-spring)] hover:scale-115 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
                style={{
                  background: hex,
                  boxShadow: on
                    ? "0 0 0 2px var(--panel-face), 0 0 0 3.5px var(--ink)"
                    : "inset 0 0 0 1px var(--hairline), inset 0 1px 1px rgba(255,255,255,0.3), var(--dot-shadow)",
                }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

/* Drag anywhere on an element and get back where you are, 0…1 on each axis */
function useDrag(onMove: (x: number, y: number) => void) {
  const ref = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const at = (e: React.PointerEvent) => {
    const r = ref.current!.getBoundingClientRect();
    onMove(clamp((e.clientX - r.left) / r.width), clamp((e.clientY - r.top) / r.height));
  };
  const handlers = {
    onPointerDown: (e: React.PointerEvent) => {
      if (e.button !== 0) return;
      e.preventDefault();
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      (e.currentTarget.querySelector("[data-thumb]") as HTMLElement | null)?.focus();
      setDragging(true);
      at(e);
    },
    onPointerMove: (e: React.PointerEvent) => dragging && at(e),
    onPointerUp: () => setDragging(false),
    onPointerCancel: () => setDragging(false),
  };
  return { ref, dragging, handlers };
}

/* A raised white ring that rides on the area and the strip */
const thumbStyle = (color: string, dragging: boolean): React.CSSProperties => ({
  background: color,
  boxShadow:
    "0 0 0 2.5px #fff, 0 0 0 3px rgba(17,17,17,0.1), 0 2px 6px rgba(17,17,17,0.3), inset 0 0 0 1px rgba(17,17,17,0.1)",
  transform: `translate(-50%, -50%) scale(${dragging ? 1.15 : 1})`,
  transition: "transform 200ms var(--ease-spring)",
});

function SaturationArea({ hsv, onChange, autoFocus }: { hsv: HSV; onChange: (hsv: HSV) => void; autoFocus?: boolean }) {
  const { ref, dragging, handlers } = useDrag((x, y) => onChange({ ...hsv, s: x, v: 1 - y }));
  const onKeyDown = (e: React.KeyboardEvent) => {
    const d = e.shiftKey ? 0.1 : 0.01;
    const moves: Record<string, Partial<HSV>> = {
      ArrowLeft: { s: clamp(hsv.s - d) },
      ArrowRight: { s: clamp(hsv.s + d) },
      ArrowUp: { v: clamp(hsv.v + d) },
      ArrowDown: { v: clamp(hsv.v - d) },
    };
    if (moves[e.key]) {
      e.preventDefault();
      onChange({ ...hsv, ...moves[e.key] });
    }
  };
  return (
    <div
      ref={ref}
      {...handlers}
      className="relative h-[148px] cursor-crosshair touch-none rounded-[10px]"
      style={{
        background: `linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, hsl(${hsv.h} 100% 50%))`,
        /* Cut into the face like a field: shade inside, lit lip below */
        boxShadow: "inset 0 0 0 1px var(--hairline), inset 0 1px 3px rgba(0,0,0,0.25)",
      }}
    >
      <span
        data-thumb
        ref={autoFocus ? (el) => el?.focus({ preventScroll: true }) : undefined}
        role="slider"
        tabIndex={0}
        aria-label="saturation and brightness"
        aria-valuetext={`saturation ${Math.round(hsv.s * 100)}%, brightness ${Math.round(hsv.v * 100)}%`}
        aria-valuenow={Math.round(hsv.s * 100)}
        aria-valuemin={0}
        aria-valuemax={100}
        onKeyDown={onKeyDown}
        className="absolute h-3.5 w-3.5 rounded-full focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-ink"
        style={{ left: `${hsv.s * 100}%`, top: `${(1 - hsv.v) * 100}%`, ...thumbStyle(hsvToHex(hsv), dragging) }}
      />
    </div>
  );
}

function HueStrip({ hue, onChange }: { hue: number; onChange: (h: number) => void }) {
  const { ref, dragging, handlers } = useDrag((x) => onChange(Math.min(359.9, x * 360)));
  const onKeyDown = (e: React.KeyboardEvent) => {
    const d = e.shiftKey ? 10 : 1;
    if (e.key === "ArrowLeft" || e.key === "ArrowDown") { e.preventDefault(); onChange((hue - d + 360) % 360); }
    if (e.key === "ArrowRight" || e.key === "ArrowUp") { e.preventDefault(); onChange((hue + d) % 360); }
  };
  return (
    <div
      ref={ref}
      {...handlers}
      className="relative mx-[7px] h-3 cursor-pointer touch-none"
    >
      <span
        aria-hidden
        className="absolute -inset-x-[7px] inset-y-0 rounded-full"
        style={{
          background: "linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)",
          boxShadow: "inset 0 0 0 1px var(--hairline), inset 0 1px 2px rgba(0,0,0,0.3)",
        }}
      />
      <span
        data-thumb
        role="slider"
        tabIndex={0}
        aria-label="hue"
        aria-valuenow={Math.round(hue)}
        aria-valuemin={0}
        aria-valuemax={360}
        onKeyDown={onKeyDown}
        className="absolute top-1/2 h-3.5 w-3.5 rounded-full focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-ink"
        style={{ left: `${(hue / 360) * 100}%`, ...thumbStyle(`hsl(${hue} 100% 50%)`, dragging) }}
      />
    </div>
  );
}

/* ── ColorPicker ──────────────────────────────────────────────────── */
interface ColorPickerProps {
  /** A hex colour, like "#2563eb" */
  value?: string;
  defaultValue?: string;
  onChange?: (hex: string) => void;
  label?: string;
  hint?: string;
  /** Preset colours under the picker; pass [] to hide them */
  swatches?: string[];
  /** Render the panel straight onto the page instead of behind a field */
  inline?: boolean;
  /** Submit the colour with a form */
  name?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
}

/* Closed, it's a sunken field holding a small raised chip of the colour.
   Open, a floating panel with a saturation area cut into its face, a hue
   strip, a hex field and a row of swatches.                            */
export function ColorPicker({
  value,
  defaultValue = "#2563eb",
  onChange,
  label,
  hint,
  swatches,
  inline = false,
  name,
  disabled = false,
  fullWidth = false,
  className = "",
}: ColorPickerProps) {
  const uid = useId();
  const ref = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [internal, setInternal] = useState(normalizeHex(defaultValue) ?? "#000000");
  const color = (value !== undefined ? normalizeHex(value) : null) ?? internal;
  const panel = useFloatingPanel(ref, { onEscape: () => buttonRef.current?.focus() });
  const { setFloating, panelStyle } = panel;

  const set = (hex: string) => {
    setInternal(hex);
    onChange?.(hex);
  };

  const labelEl = label && <FieldLabel id={`${uid}-label`}>{label}</FieldLabel>;
  const hintEl = <FieldMessage hint={hint} />;
  const hidden = name && <input type="hidden" name={name} value={color} />;

  if (inline) {
    return (
      <div role="group" aria-labelledby={label ? `${uid}-label` : undefined} className={["flex flex-col gap-1.5", className].join(" ")}>
        {labelEl}
        <div className="w-fit rounded-[16px] p-1.5" style={{ background: "var(--panel-bezel)", boxShadow: "var(--panel-shadow)" }}>
          <div className="rounded-[11px] bg-panel-face p-3" style={{ boxShadow: "var(--panel-face-shadow)" }}>
            <ColorPanel value={color} onChange={set} swatches={swatches} />
          </div>
        </div>
        {hintEl}
        {hidden}
      </div>
    );
  }

  return (
    <div className={["group/field flex flex-col gap-1.5", fullWidth ? "w-full" : ""].join(" ")}>
      {labelEl}
      <div ref={ref} className={["relative", fullWidth ? "w-full" : "inline-block w-48", className].join(" ")}>
        <button
          ref={buttonRef}
          type="button"
          disabled={disabled}
          onClick={panel.toggle}
          aria-haspopup="dialog"
          aria-expanded={panel.open}
          aria-controls={panel.open ? `${uid}-panel` : undefined}
          aria-labelledby={label ? `${uid}-label ${uid}-value` : undefined}
          data-open={panel.open || undefined}
          className="field group/color relative isolate flex w-full cursor-pointer items-center gap-2.5 rounded-xl py-2.5 pl-2.5 pr-4 text-left focus:outline-none disabled:opacity-40 disabled:pointer-events-none"
        >
          <span
            aria-hidden
            className="h-6 w-6 shrink-0 rounded-[7px] transition-transform duration-300 ease-[var(--ease-spring)] group-hover/color:scale-105"
            style={{
              background: color,
              boxShadow:
                "var(--key-shadow), inset 0 1px 1px rgba(255,255,255,0.3), inset 0 0 0 1px var(--hairline)",
            }}
          />
          <span id={`${uid}-value`} className="flex-1 font-mono text-[13px] uppercase tracking-[0.02em] text-ink">
            {color}
          </span>
          <svg
            aria-hidden
            width="14"
            height="14"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            className={[
              "shrink-0 transition-[transform,color] duration-300 ease-[var(--ease-spring)]",
              panel.open ? "rotate-180 text-ink" : "text-ink-faint group-hover/color:text-ink-label",
            ].join(" ")}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {hidden}
      </div>
      {panel.mounted && (
        <Portal>
          <div
            ref={setFloating}
            id={`${uid}-panel`}
            role="dialog"
            aria-label={label ? `choose ${label}` : "choose a colour"}
            className="rounded-[16px] p-1.5"
            style={panelStyle}
          >
            <div className="rounded-[11px] bg-panel-face p-3" style={{ boxShadow: "var(--panel-face-shadow)" }}>
              <ColorPanel value={color} onChange={set} swatches={swatches} autoFocus />
            </div>
          </div>
        </Portal>
      )}
      {hintEl}
    </div>
  );
}
