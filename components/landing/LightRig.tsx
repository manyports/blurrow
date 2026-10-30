"use client";

import { useEffect, useRef, useState } from "react";
import { CardShell } from "@/components/ui/CardShell";
import { playClick } from "./click";
import { useInView } from "./useInView";

const HOME = 0.5;

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
/* Overshoots home a little and settles, like something on a cord */
const swingBack = (t: number) => {
  const c1 = 1.5;
  const c3 = c1 + 1;
  return 1 + c3 * (t - 1) ** 3 + c1 * (t - 1) ** 2;
};
/* Where each card's centre sits across the stage, so each one works out
   its own angle to the lamp                                          */
const CARDS = [
  { theme: "light" as const, at: 0.3 },
  { theme: "dark" as const, at: 0.7 },
];

function LitCard({ theme, lamp, at }: { theme: "light" | "dark"; lamp: number; at: number }) {
  // -1 when the lamp is far left of this card, 1 when far right
  const d = Math.max(-1, Math.min(1, (lamp - at) / 0.45));
  const dark = theme === "dark";

  return (
    <div className="relative w-full">
      {/* The shadow falls away from the lamp, and stretches as it gets lower */}
      <span
        aria-hidden
        className="absolute inset-2 rounded-[24px]"
        style={{
          background: "rgba(17,17,17,0.5)",
          filter: "blur(18px)",
          opacity: 0.45,
          transform: `translate(${-d * 30}px, ${16 + Math.abs(d) * 8}px) scaleX(${1 + Math.abs(d) * 0.06})`,
        }}
      />
      <CardShell theme={theme} railKind="text" rail={<span>{theme}</span>}>
        <div className="p-5 sm:p-6 min-h-[120px] sm:min-h-[140px] flex flex-col justify-end">
          <p className={["text-[15px] font-medium", dark ? "text-white" : "text-neutral-900"].join(" ")}>weekly digest</p>
          <p className={["text-[13px] mt-1", dark ? "text-neutral-400" : "text-neutral-500"].join(" ")}>
            goes out every monday at 9am
          </p>
        </div>
      </CardShell>
      {/* Light raking across the surface from the lamp's side */}
      <span
        aria-hidden
        className="absolute inset-0 rounded-[24px] pointer-events-none"
        style={{
          background: `linear-gradient(${180 + d * 50}deg, rgba(255,255,255,${dark ? 0.22 : 0.5}) 0%, rgba(255,255,255,0) 42%, rgba(17,17,17,${dark ? 0.18 : 0.07}) 100%)`,
        }}
      />
    </div>
  );
}

/* The kit's one light source, handed to the reader. Wherever it's
   dragged, every shadow and highlight follows; let go and it swings
   back overhead, which is where it lives in the kit.                 */
export function LightRig() {
  const [ref, inView] = useInView<HTMLDivElement>(0.5);
  const stage = useRef<HTMLDivElement>(null);
  const [lamp, setLamp] = useState(HOME);
  const [dragging, setDragging] = useState(false);
  const [touched, setTouched] = useState(false);
  const releaseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lampRef = useRef(HOME);
  const frame = useRef(0);

  /* Gradients can't be transitioned, so the lamp's position is tweened
     here and everything lit by it is recomputed each frame            */
  const animateTo = (to: number, ms: number, ease: (t: number) => number) => {
    cancelAnimationFrame(frame.current);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      lampRef.current = to;
      setLamp(to);
      return;
    }
    const from = lampRef.current;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / ms);
      const x = from + (to - from) * ease(t);
      lampRef.current = x;
      setLamp(x);
      if (t < 1) frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
  };
  const set = (x: number) => {
    cancelAnimationFrame(frame.current);
    lampRef.current = x;
    setLamp(x);
  };
  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  // One swing on first sight, so it's obvious the lamp can move
  useEffect(() => {
    if (!inView || touched) return;
    const steps: [number, number, number][] = [
      [400, 0.12, 900],
      [1400, 0.88, 1300],
      [2800, HOME, 900],
    ];
    const ids = steps.map(([t, x, ms]) => setTimeout(() => animateTo(x, ms, easeInOut), t));
    return () => ids.forEach(clearTimeout);
  }, [inView, touched]);

  const fromPointer = (clientX: number) => {
    const r = stage.current!.getBoundingClientRect();
    return Math.max(0.04, Math.min(0.96, (clientX - r.left) / r.width));
  };

  const grab = (e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setTouched(true);
    setDragging(true);
    set(fromPointer(e.clientX));
    playClick({ pitch: 0.7, volume: 0.08 });
  };
  const drag = (e: React.PointerEvent) => {
    if (dragging) set(fromPointer(e.clientX));
  };
  const release = () => {
    if (!dragging) return;
    setDragging(false);
    animateTo(HOME, 900, swingBack);
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();
    setTouched(true);
    set(Math.max(0.04, Math.min(0.96, lampRef.current + (e.key === "ArrowLeft" ? -0.06 : 0.06))));
    if (releaseTimer.current) clearTimeout(releaseTimer.current);
    releaseTimer.current = setTimeout(() => animateTo(HOME, 900, swingBack), 900);
  };


  return (
    <figure ref={ref} className="m-0 flex flex-col gap-3">
      <div
        ref={stage}
        className="relative h-[340px] sm:h-[380px] rounded-[24px] overflow-hidden select-none"
        style={{
          background: "#d6d6d6",
          boxShadow: "inset 0 0 2px rgba(17,17,17,0.14), inset 0 1px 3px rgba(17,17,17,0.08)",
        }}
      >
        {/* The pool of light, wherever the lamp hangs */}
        <span
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(60% 95% at ${lamp * 100}% -6%, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.45) 45%, rgba(255,255,255,0) 80%)`,
          }}
        />
        {/* The track the lamp slides along */}
        <span aria-hidden className="absolute top-[14px] inset-x-6 h-px bg-neutral-900/15" />

        <div
          role="slider"
          tabIndex={0}
          aria-label="lamp position"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(lamp * 100)}
          onPointerDown={grab}
          onPointerMove={drag}
          onPointerUp={release}
          onPointerCancel={release}
          onKeyDown={onKey}
          className={[
            "absolute top-[6px] -translate-x-1/2 z-10 px-3 py-2 touch-none rounded-[10px] outline-none focus-visible:outline-2 focus-visible:outline-neutral-900",
            dragging ? "cursor-grabbing" : "cursor-grab",
          ].join(" ")}
          style={{ left: `${lamp * 100}%` }}
        >
          <span className="flex flex-col items-center">
            <span
              className="block w-14 h-3.5 rounded-full"
              style={{
                background: "var(--face-dark)",
                boxShadow: "var(--face-dark-shadow)",
                transform: dragging ? "scale(1.06)" : "none",
                transition: "transform 200ms var(--ease-spring)",
              }}
            />
            <span
              className="block w-9 h-[3px] -mt-[2px] rounded-full bg-white"
              style={{ boxShadow: "0 4px 18px 6px rgba(255,255,255,0.95)" }}
            />
          </span>
        </div>

        <div className="absolute inset-x-0 bottom-10 sm:bottom-12 px-5 sm:px-12 grid grid-cols-2 gap-5 sm:gap-10">
          {CARDS.map((c) => (
            <LitCard key={c.theme} theme={c.theme} at={c.at} lamp={lamp} />
          ))}
        </div>
      </div>
      <figcaption className="text-[13px] leading-[1.55] text-neutral-500 max-w-[52ch]">
        go ahead, drag the lamp. let go and it swings back overhead, which is where it stays in the kit.
      </figcaption>
    </figure>
  );
}
