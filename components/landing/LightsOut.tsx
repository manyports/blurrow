"use client";

import { useEffect, useRef, useState } from "react";
import { playClick } from "./click";
import { useInView } from "./useInView";

const REST = 132; // cord length at rest, px
const TRIGGER = 34; // how far it has to be pulled to switch

/* A dark room at the end of the page, with a lamp on a pull cord. Pull
   it and the light flickers on over whatever's inside; pull again and
   it goes dark. The content is always in the page, just unlit.

   Once it's on screen the cord nudges you: a small tug, then a bigger
   one, and if both go unanswered it pulls itself.                    */
export function LightsOut({ children }: { children: React.ReactNode }) {
  const [on, setOn] = useState(false);
  const [pull, setPull] = useState(0);
  const [dragging, setDragging] = useState(false);
  const startY = useRef(0);
  const lit = useRef<HTMLDivElement>(null);
  const cord = useRef<HTMLDivElement>(null);
  const [room, inView] = useInView<HTMLDivElement>(0.5);
  const [label, setLabel] = useState("pull me");
  const touched = useRef(false);
  const hints = useRef(0);

  const toggle = () => {
    const next = !on;
    setOn(next);
    playClick({ pitch: next ? 0.9 : 0.75, volume: 0.16 });
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (still) return;
    // An old bulb catching: a couple of stutters before it holds
    if (next)
      lit.current?.animate(
        [
          { opacity: 0 },
          { opacity: 0.9, offset: 0.08 },
          { opacity: 0.15, offset: 0.16 },
          { opacity: 1, offset: 0.3 },
          { opacity: 0.55, offset: 0.4 },
          { opacity: 1 },
        ],
        { duration: 700, easing: "linear" },
      );
    // The cord swings after it's let go
    cord.current?.animate(
      [
        { transform: "rotate(0deg)" },
        { transform: "rotate(7deg)" },
        { transform: "rotate(-5deg)" },
        { transform: "rotate(3deg)" },
        { transform: "rotate(-1.5deg)" },
        { transform: "rotate(0deg)" },
      ],
      { duration: 1400, easing: "ease-out" },
    );
  };

  /* Hints. Scroll it into view and the cord rattles; 0.45s after that it
     rattles again; 0.45s later it pulls itself. Leaving the
     view stops the sequence, and any touch of the cord ends it.       */
  useEffect(() => {
    if (!inView || on || touched.current || hints.current >= 3) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const later = (ms: number, fn: () => void) => timers.push(setTimeout(fn, ms));
    const RATTLE = 620;

    // A quick side-to-side shake with a little downward jiggle
    const rattle = () => {
      cord.current?.animate(
        [
          { transform: "rotate(0deg)" },
          { transform: "rotate(5deg)", offset: 0.15 },
          { transform: "rotate(-5deg)", offset: 0.32 },
          { transform: "rotate(4deg)", offset: 0.48 },
          { transform: "rotate(-3deg)", offset: 0.64 },
          { transform: "rotate(1.5deg)", offset: 0.82 },
          { transform: "rotate(0deg)" },
        ],
        { duration: RATTLE, easing: "ease-out" },
      );
      setPull(8);
      later(140, () => setPull(0));
    };

    const step = () => {
      if (touched.current) return;
      hints.current++;
      if (hints.current === 1) {
        rattle();
        later(RATTLE + 450, step);
      } else if (hints.current === 2) {
        setLabel("go on, pull me");
        rattle();
        later(RATTLE + 450, step);
      } else {
        setLabel("fine, i'll do it.");
        setPull(TRIGGER + 16);
        later(420, () => {
          setPull(0);
          toggle();
        });
      }
    };
    later(400, step);
    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, on]);

  const grab = (e: React.PointerEvent) => {
    touched.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    startY.current = e.clientY;
    setDragging(true);
  };
  const drag = (e: React.PointerEvent) => {
    if (!dragging) return;
    // Resistance grows the further it goes
    const dy = Math.max(0, e.clientY - startY.current);
    setPull(Math.min(80, dy * (1 - Math.min(dy, 160) / 400)));
  };
  const release = () => {
    if (!dragging) return;
    setDragging(false);
    if (pull > TRIGGER) toggle();
    setPull(0);
  };

  return (
    <div ref={room} className="relative rounded-[28px] overflow-hidden min-h-[540px] sm:min-h-[580px] select-none" style={{ background: "#0e0e0e" }}>
      {/* The room with the light on */}
      <div
        ref={lit}
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(70% 85% at 50% 0%, #fbfbfb 0%, #ececec 45%, #d4d4d4 100%)",
          opacity: on ? 1 : 0,
          transition: on ? "none" : "opacity 220ms ease-in",
        }}
      />
      {/* Even in the dark, a faint shape of the lamp against the ceiling */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(40% 30% at 50% 0%, rgba(255,255,255,0.06), rgba(255,255,255,0))", opacity: on ? 0 : 1 }}
      />

      {/* Pendant lamp */}
      <div aria-hidden className="absolute top-0 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none">
        <span className="block w-px h-14" style={{ background: on ? "#9a9a9a" : "#3a3a3a" }} />
        <span
          className="block w-28 h-12 rounded-t-[56px]"
          style={{ background: "linear-gradient(180deg, #2e2e2e 0%, #121212 100%)", boxShadow: "inset 0 2px 3px -2px rgba(255,255,255,0.18)" }}
        />
        <span
          className="block w-12 h-3 -mt-px rounded-b-full transition-[background-color,box-shadow] duration-300"
          style={{
            background: on ? "#ffffff" : "#2a2a2a",
            boxShadow: on ? "0 6px 40px 14px rgba(255,255,255,0.95), 0 20px 120px 40px rgba(255,255,255,0.6)" : "none",
          }}
        />
      </div>

      {/* Pull cord */}
      <div
        ref={cord}
        className="absolute top-0 left-[calc(50%+76px)] z-20 flex flex-col items-center origin-top"
      >
        <span
          aria-hidden
          className="block w-px"
          style={{
            height: REST + pull,
            background: on ? "#8a8a8a" : "#4a4a4a",
            transition: dragging ? "none" : "height 600ms var(--ease-spring)",
          }}
        />
        <button
          type="button"
          aria-label={on ? "turn the light off" : "turn the light on"}
          aria-pressed={on}
          onPointerDown={grab}
          onPointerMove={drag}
          onPointerUp={release}
          onPointerCancel={release}
          onClick={(e) => {
            // Keyboard presses arrive as clicks with no pointer detail
            if (e.detail === 0) {
              touched.current = true;
              toggle();
            }
          }}
          className={[
            "-mt-px w-5 h-7 rounded-full touch-none outline-none focus-visible:outline-2 focus-visible:outline-offset-2",
            on ? "focus-visible:outline-neutral-900" : "focus-visible:outline-white",
            dragging ? "cursor-grabbing" : "cursor-grab",
          ].join(" ")}
          style={{
            background: on ? "var(--face-light)" : "linear-gradient(180deg, #3a3a3a, #222)",
            boxShadow: on ? "var(--tile-light-shadow)" : "inset 0 1px 1px rgba(255,255,255,0.12), 0 2px 4px rgba(0,0,0,0.5)",
          }}
        />
        <span
          aria-hidden
          className="mt-3 text-[12.5px] whitespace-nowrap transition-opacity duration-300"
          style={{ color: on ? "#8a8a8a" : "#9a9a9a", opacity: dragging ? 0 : 1 }}
        >
          {on ? "pull to switch off" : label}
        </span>
      </div>

      {/* What's in the room */}
      <div
        className="relative z-10 px-6 sm:px-16 pt-[230px] pb-14 flex flex-col items-center text-center gap-6"
        style={{ opacity: on ? 1 : 0.05, transition: on ? "opacity 500ms ease-out 120ms" : "opacity 200ms ease-in" }}
      >
        {children}
      </div>
    </div>
  );
}
