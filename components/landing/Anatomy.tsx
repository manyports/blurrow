"use client";

import { useEffect, useState } from "react";
import { playClick } from "./click";
import { useInView } from "./useInView";

function Marker({ n, show }: { n: number; show: boolean }) {
  return (
    <span
      aria-hidden
      className="absolute -left-3 -top-3 w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-semibold text-neutral-700 tabular-nums"
      style={{
        background: "var(--face-light)",
        boxShadow: "var(--tile-light-shadow)",
        opacity: show ? 1 : 0,
        transition: "opacity 400ms ease",
      }}
    >
      {n}
    </span>
  );
}

const parts = ["label", "face", "bezel"];

/* Light from the lamp landing on a layer: a sheen across its surface and
   a bright lip on its edge. Off while assembled, where the button's own
   tokens already do this job.                                         */
function Sheen({ on }: { on: boolean }) {
  return (
    <span
      aria-hidden
      className="absolute inset-0 rounded-[inherit] pointer-events-none"
      style={{
        background: "linear-gradient(180deg, rgba(255,255,255,0.34) 0%, rgba(255,255,255,0.08) 45%, rgba(255,255,255,0) 75%)",
        boxShadow: "inset 0 1.5px 0 rgba(255,255,255,0.55), inset 0 0 0 1px rgba(255,255,255,0.16)",
        opacity: on ? 1 : 0,
        transition: "opacity 900ms ease",
      }}
    />
  );
}

/* A primary button pulled apart along the axis the light comes from.
   It separates once on first view; after that the reader drives it.
   Put back together, it's an ordinary button that presses.          */
export function Anatomy() {
  const [ref, inView] = useInView<HTMLDivElement>(0.5);
  const [apart, setApart] = useState(false);
  const [touched, setTouched] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [hover, setHover] = useState(false);

  useEffect(() => {
    if (!inView || touched) return;
    const id = setTimeout(() => setApart(true), 600);
    return () => clearTimeout(id);
  }, [inView, touched]);

  const z = (layer: number) => (apart ? layer * 70 : 0);
  const faceOffset = !apart && pressed ? 1 : !apart && hover ? -1 : 0;

  return (
    <figure className="m-0 flex flex-col gap-3">
      <div
        ref={ref}
        className="relative h-[340px] sm:h-[420px] rounded-[24px] flex items-center justify-center overflow-hidden"
        style={{
          background: "linear-gradient(180deg, #e9e9e9 0%, #e2e2e2 100%)",
          boxShadow: "inset 0 0 2px rgba(17,17,17,0.12), inset 0 1px 3px rgba(17,17,17,0.06)",
          perspective: "1400px",
        }}
      >
        {/* The room dims at the edges while the lamp is on */}
        <span
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(55% 60% at 50% 58%, rgba(17,17,17,0) 0%, rgba(17,17,17,0.1) 50%, rgba(17,17,17,0.42) 100%)",
            opacity: apart ? 1 : 0,
            transition: "opacity 900ms ease",
          }}
        />
        {/* The beam, from the lamp down onto the button */}
        <span
          aria-hidden
          className="absolute left-1/2 -translate-x-1/2 top-[22px] bottom-[8%] w-[560px] pointer-events-none"
          style={{
            clipPath: "polygon(46.5% 0, 53.5% 0, 100% 100%, 0 100%)",
            background: "linear-gradient(180deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.28) 45%, rgba(255,255,255,0) 100%)",
            filter: "blur(10px)",
            opacity: apart ? 1 : 0,
            transition: "opacity 900ms ease",
          }}
        />
        {/* Where the beam lands */}
        <span
          aria-hidden
          className="absolute left-1/2 top-[56%] -translate-x-1/2 -translate-y-1/2 w-[420px] h-[220px] rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(closest-side, rgba(255,255,255,0.9), rgba(255,255,255,0))",
            opacity: apart ? 1 : 0,
            transition: "opacity 900ms ease",
          }}
        />
        {/* The lamp: a small dark fixture with a lit underside */}
        <span aria-hidden className="absolute top-3 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none">
          <span
            className="block w-16 h-3 rounded-full"
            style={{ background: "var(--face-dark)", boxShadow: "var(--face-dark-shadow)" }}
          />
          <span
            className="block w-10 h-[3px] -mt-[2px] rounded-full bg-white"
            style={{
              boxShadow: apart ? "0 4px 18px 6px rgba(255,255,255,0.95)" : "0 2px 6px 1px rgba(255,255,255,0.5)",
              opacity: apart ? 1 : 0.6,
              transition: "box-shadow 900ms ease, opacity 900ms ease",
            }}
          />
        </span>

        <button
          type="button"
          aria-label="publish"
          onPointerEnter={() => setHover(true)}
          onPointerLeave={() => {
            setHover(false);
            setPressed(false);
          }}
          onPointerDown={() => {
            setPressed(true);
            if (!apart) playClick();
          }}
          onPointerUp={() => {
            setPressed(false);
            if (!apart) playClick({ pitch: 1.25, volume: 0.1 });
          }}
          className="relative z-10 w-[240px] h-[86px] sm:w-[300px] sm:h-[104px] cursor-pointer outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-900 rounded-[26px]"
          style={{
            transformStyle: "preserve-3d",
            transform: apart ? "rotateX(52deg) rotateZ(-30deg) scale(0.9)" : "none",
            transition: "transform 1200ms var(--ease-out-soft)",
          }}
        >
          {/* The shadow it casts falls further away the higher it's lifted */}
          <span
            aria-hidden
            className="absolute inset-0 rounded-[26px]"
            style={{
              background: "rgba(17,17,17,0.35)",
              filter: apart ? "blur(28px)" : "blur(14px)",
              opacity: apart ? 0.5 : 0.3,
              transform: apart ? "translateZ(-50px)" : "translateY(10px) scale(0.92)",
              transition: "all 1200ms var(--ease-out-soft)",
            }}
          />
          <span
            aria-hidden
            className="absolute inset-0 rounded-[26px]"
            style={{ background: "var(--bezel-dark)", boxShadow: "var(--bezel-dark-shadow)", transform: `translateZ(${z(0)}px)` }}
          >
            <Sheen on={apart} />
            <Marker n={3} show={apart} />
          </span>
          <span
            aria-hidden
            className="absolute inset-[7px] sm:inset-[8px] rounded-[19px]"
            style={{
              background: "var(--face-dark)",
              boxShadow: faceOffset > 0 ? "var(--face-dark-pressed)" : "var(--face-dark-shadow)",
              transform: `translateZ(${z(1)}px) translateY(${faceOffset}px)`,
              transition: "transform 1200ms var(--ease-out-soft), box-shadow 160ms ease",
            }}
          >
            <Sheen on={apart} />
            <Marker n={2} show={apart} />
          </span>
          {/* Lifted off its face, white type would vanish into the light,
              so the label darkens while it floats                        */}
          <span
            className="absolute inset-0 flex items-center justify-center text-[21px] sm:text-[24px] font-medium tracking-[-0.02em]"
            style={{
              color: apart ? "#0a0a0a" : "#fff",
              fontWeight: apart ? 600 : 500,
              textShadow: apart ? "0 6px 10px rgba(17,17,17,0.18)" : "0 -1px 0 rgba(0,0,0,0.45)",
              transform: `translateZ(${z(2)}px) translateY(${faceOffset}px)`,
              transition: "transform 1200ms var(--ease-out-soft), color 600ms ease, text-shadow 600ms ease",
            }}
          >
            <span className="relative">
              publish
              <Marker n={1} show={apart} />
            </span>
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            setTouched(true);
            setApart((a) => !a);
            playClick({ pitch: 0.8, volume: 0.12 });
          }}
          className="absolute z-10 bottom-4 right-4 h-8 px-3 rounded-[9px] text-[12.5px] font-medium text-neutral-700 cursor-pointer transition-transform active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"
          style={{ background: "var(--face-light)", boxShadow: "var(--face-light-shadow)" }}
        >
          {apart ? "put it back" : "take it apart"}
        </button>
      </div>
      <figcaption className="text-[13px] leading-[1.55] text-neutral-500 max-w-[52ch]">
        our primary button, in three layers:{" "}
        {parts.map((p, i) => (
          <span key={p}>
            {i > 0 && ", "}
            <span className="text-neutral-800">
              {i + 1} {p.toLowerCase()}
            </span>
          </span>
        ))}
        . put it back together and give it a press.
      </figcaption>
    </figure>
  );
}
