"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "./Button";
import { CardShell } from "./CardShell";

interface CarouselProps {
  items: React.ReactNode[];
  autoPlay?: boolean;
  interval?: number;
  className?: string;
}

const SLIDE_MS = 680;

interface Slot {
  itemIndex: number;
  key: string;
  role: "current" | "prev";
}

export function Carousel({
  items,
  autoPlay = false,
  interval = 4000,
  className = "",
}: CarouselProps) {
  const [slots, setSlots] = useState<Slot[]>([
    { itemIndex: 0, key: "s-0-0", role: "current" },
  ]);
  const [direction, setDirection] = useState<"left" | "right">("right");
  const [currentIdx, setCurrentIdx] = useState(0);
  // Autoplay never moves content out from under someone looking at it
  const [paused, setPaused] = useState(false);

  const currentIdxRef = useRef(0);
  const lockedRef     = useRef(false);
  const tcRef         = useRef(0);
  const cleanupRef    = useRef<ReturnType<typeof setTimeout> | null>(null);

  const go = (nextIdx: number, dir: "left" | "right") => {
    if (lockedRef.current || nextIdx === currentIdxRef.current) return;

    const prevIdx = currentIdxRef.current;
    const tc      = ++tcRef.current;

    lockedRef.current  = true;
    currentIdxRef.current = nextIdx;

    setDirection(dir);
    setCurrentIdx(nextIdx);
    setSlots([
      { itemIndex: nextIdx, key: `c-${nextIdx}-${tc}`, role: "current" },
      { itemIndex: prevIdx, key: `p-${prevIdx}-${tc}`, role: "prev"    },
    ]);

    if (cleanupRef.current) clearTimeout(cleanupRef.current);
    cleanupRef.current = setTimeout(() => {
      setSlots([{ itemIndex: nextIdx, key: `c-${nextIdx}-${tc}`, role: "current" }]);
      lockedRef.current = false;
    }, SLIDE_MS + 20);
  };

  const goNext = () => go((currentIdxRef.current + 1) % items.length, "right");
  const goPrev = () => go((currentIdxRef.current - 1 + items.length) % items.length, "left");

  const goNextRef = useRef(goNext);
  goNextRef.current = goNext;

  useEffect(() => {
    if (!autoPlay || paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => goNextRef.current(), interval);
    return () => clearInterval(id);
  }, [autoPlay, interval, paused]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") { e.preventDefault(); goNextRef.current(); }
    if (e.key === "ArrowLeft") { e.preventDefault(); goPrev(); }
  };

  useEffect(() => () => { if (cleanupRef.current) clearTimeout(cleanupRef.current); }, []);

  // ── Swipe / pointer drag ──────────────────────────────────────────
  const dragRef   = useRef<{ x: number; y: number; active: boolean }>({ x: 0, y: 0, active: false });
  const THRESHOLD = 48;

  const onPointerDown = (e: React.PointerEvent) => {
    dragRef.current = { x: e.clientX, y: e.clientY, active: true };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (!dragRef.current.active) return;
    const dx = e.clientX - dragRef.current.x;
    const dy = e.clientY - dragRef.current.y;
    dragRef.current.active = false;
    if (Math.abs(dx) > THRESHOLD && Math.abs(dx) > Math.abs(dy) * 1.5) {
      dx < 0 ? goNextRef.current() : goPrev();
    }
  };

  const onPointerCancel = () => { dragRef.current.active = false; };

  /* A plain slide: the incoming and outgoing slides travel together as
     one strip, a full width each. The curve is a strong ease-out, so the
     strip moves the instant you click and then settles — an ease-in-out
     hesitates first, which reads as lag. Driven by the Web Animations API
     on mount, so it never depends on a stylesheet.                     */
  const slide = (role: Slot["role"]) => (el: HTMLDivElement | null) => {
    if (!el || el.dataset.animated || slots.length < 2) return;
    el.dataset.animated = "1";
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const sign = direction === "right" ? 1 : -1;
    const frames =
      role === "current"
        ? [{ transform: `translateX(${sign * 100}%)` }, { transform: "translateX(0)" }]
        : [{ transform: "translateX(0)" }, { transform: `translateX(${-sign * 100}%)` }];
    el.animate(frames, { duration: SLIDE_MS, easing: "cubic-bezier(0.22, 1, 0.36, 1)", fill: "both" });
  };

  const controls = (
    <div className="w-full flex items-center justify-between">
      <div className="flex items-center gap-3 pl-1.5">
        {/* Dots sit in a well; the active one fills over the autoplay
            interval, and the fill holds while autoplay is paused        */}
        <div
          className="flex items-center gap-1 rounded-full p-[5px]"
          style={{ background: "var(--well)", boxShadow: "var(--well-shadow)" }}
        >
          {items.map((_, i) => {
            const active = i === currentIdx;
            return (
              <button
                key={i}
                onClick={() => go(i, i > currentIdxRef.current ? "right" : "left")}
                className={[
                  "relative h-1.5 rounded-full overflow-hidden cursor-pointer",
                  "transition-[width,background] duration-300 ease-[var(--ease-out-soft)]",
                  "after:absolute after:-inset-2 after:content-['']",
                  active ? "w-6 bg-ink/15" : "w-1.5 bg-ink/20 hover:bg-ink/40",
                ].join(" ")}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={active ? "true" : undefined}
              >
                {active && (
                  <span
                    key={`${currentIdx}-${autoPlay}`}
                    aria-hidden
                    className={["absolute inset-0 rounded-full origin-left", autoPlay ? "carousel-progress" : ""].join(" ")}
                    style={{
                      background: "var(--face-inverse)",
                      animationDuration: `${interval}ms`,
                      animationPlayState: paused ? "paused" : "running",
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>
        <span className="text-[12px] font-medium text-ink-body tabular-nums">
          {currentIdx + 1}
          <span className="text-ink-faint"> / {items.length}</span>
        </span>
      </div>

      <div className="flex gap-2">
        <Button variant="secondary" size="sm" square onClick={goPrev} aria-label="Previous slide">
          <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </Button>
        <Button variant="secondary" size="sm" square onClick={goNext} aria-label="Next slide">
          <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Button>
      </div>
    </div>
  );

  /* Built on the card chassis like every other surface: slides are the
     face, controls live on the rail below it.                          */
  return (
    <section
      aria-roledescription="carousel"
      aria-label="Carousel"
      onKeyDown={onKeyDown}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setPaused(false);
      }}
      className={className}
    >
      <CardShell rail={controls}>
        <div
          className="relative w-full overflow-hidden cursor-grab active:cursor-grabbing touch-pan-y"
          style={{ minHeight: 300 }}
          aria-live={autoPlay && !paused ? "off" : "polite"}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerCancel}
        >
          {slots.map((slot) => (
            <div
              key={slot.key}
              role="group"
              aria-roledescription="slide"
              aria-label={`${slot.itemIndex + 1} of ${items.length}`}
              aria-hidden={slot.role === "prev"}
              ref={slide(slot.role)}
              className={["absolute inset-0 will-change-transform [backface-visibility:hidden]", slot.role === "prev" ? "pointer-events-none" : ""].join(" ")}
            >
              {items[slot.itemIndex]}
            </div>
          ))}
        </div>
      </CardShell>
    </section>
  );
}

type SlideTheme = "dark" | "light" | "tint";

interface CarouselSlideProps {
  theme?: SlideTheme;
  /** Background for the "tint" theme */
  tint?: string;
  icon?: React.ReactNode;
  title: React.ReactNode;
  meta?: React.ReactNode;
}

/* A ready-made slide in the cards' vocabulary: the card's own material,
   a raised icon tile, and the same fading dot grid as empty media.    */
export function CarouselSlide({ theme = "dark", tint = "#8A8E7A", icon, title, meta }: CarouselSlideProps) {
  const dark = theme !== "light";
  return (
    <div
      className="relative w-full h-full flex flex-col justify-end gap-6 p-8 overflow-hidden select-none"
      style={{
        background: theme === "dark" ? "var(--card-dark)" : theme === "light" ? "var(--card)" : tint,
      }}
    >
      <div
        aria-hidden
        className="absolute inset-y-0 right-0 w-3/5"
        style={{
          backgroundImage: `radial-gradient(${
            theme === "tint" ? "var(--media-dots-on-colour)" : dark ? "var(--media-dots-dark)" : "var(--slide-dots)"
          } 1px, transparent 1px)`,
          backgroundSize: "12px 12px",
          maskImage: "radial-gradient(60% 70% at 70% 50%, black 0%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(60% 70% at 70% 50%, black 0%, transparent 100%)",
        }}
      />
      {icon && (
        <div
          aria-hidden
          className={[
            "relative w-9 h-9 rounded-[11px] flex items-center justify-center mb-auto",
            dark ? "text-neutral-100" : "text-ink-label",
          ].join(" ")}
          style={{
            background: dark ? "var(--tile-dark)" : "var(--tile)",
            boxShadow: dark ? "var(--tile-dark-shadow)" : "var(--tile-shadow)",
          }}
        >
          {icon}
        </div>
      )}
      <div className="relative">
        <p
          className={[
            "text-[22px] font-medium leading-[1.2] tracking-[-0.015em] mb-2",
            dark ? "text-white" : "text-ink",
          ].join(" ")}
        >
          {title}
        </p>
        {meta && (
          <p className={["text-[13px]", theme === "tint" ? "text-white/65" : dark ? "text-neutral-400" : "text-ink-muted"].join(" ")}>
            {meta}
          </p>
        )}
      </div>
    </div>
  );
}
