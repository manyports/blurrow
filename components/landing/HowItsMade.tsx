"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Lamp } from "./Lamp";
import { playClick } from "./click";
import { arrow, box, hatch, scribble, stroke, twice } from "./sketch";

/* ── The story ─────────────────────────────────────────────────────── */

interface Part {
  n: number;
  name: string;
  note: string;
  code?: boolean;
}

const steps: { title: string; body: string; fig: string; parts: Part[] }[] = [
  {
    title: "a face, set in a bezel.",
    body: "the bezel never moves. the face lifts a pixel when you hover and sinks flush when you press, so a click feels like it went somewhere.",
    fig: "face and bezel",
    parts: [
      { n: 1, name: "face", note: "lifts on hover, sinks on press" },
      { n: 2, name: "bezel", note: "holds still, always" },
    ],
  },
  {
    title: "three layers. nothing else.",
    body: "a bezel, a face and a label. no images and no canvas, just gradients and shadows from one set of tokens, which is why every key in the kit matches every other.",
    fig: "exploded view",
    parts: [
      { n: 1, name: "label", note: "text, embossed" },
      { n: 2, name: "face", note: "--face-dark", code: true },
      { n: 3, name: "bezel", note: "--bezel-dark", code: true },
    ],
  },
  {
    title: "one lamp, right overhead.",
    body: "highlights sit on top edges and shadows fall below, as if one light hangs over your screen. here it swings so you can watch them follow. in the kit it never moves.",
    fig: "lighting",
    parts: [
      { n: 1, name: "highlight", note: "on the edge facing the light" },
      { n: 2, name: "shadow", note: "falls away from it" },
    ],
  },
  {
    title: "raised to press. sunken to fill.",
    body: "fields are cut into the surface and keys stand up from it, so you can tell which is which before you've read a word. every part in the kit is one or the other.",
    fig: "raised and sunken",
    parts: [
      { n: 1, name: "field", note: "--field", code: true },
      { n: 2, name: "key", note: "--face", code: true },
    ],
  },
];

const still = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function Legend({ parts, className = "" }: { parts: Part[]; className?: string }) {
  return (
    <ul className={["flex flex-wrap gap-x-6 gap-y-2", className].join(" ")}>
      {parts.map((p) => (
        <li key={p.name} className="flex items-center gap-2 text-[13px]">
          <span
            className="grid h-5 w-5 shrink-0 place-items-center rounded-full text-[10.5px] font-semibold tabular-nums text-ink-label"
            style={{ background: "var(--face)", boxShadow: "var(--key-shadow)" }}
          >
            {p.n}
          </span>
          <span className="font-medium text-ink">{p.name}</span>
          <span className={p.code ? "font-mono text-[12px] text-ink-muted" : "text-ink-muted"}>{p.note}</span>
        </li>
      ))}
    </ul>
  );
}

/* One object, and four short steps scrolling past it. The plate is
   pinned the whole way: beside the text on a wide screen, across the
   top on a phone, where it's shorter and the steps scroll up beneath
   it. A step takes over when it reaches the middle of whatever part of
   the screen the plate isn't using.                               */
export function HowItsMade() {
  const [step, setStep] = useState(0);
  const refs = useRef<(HTMLDivElement | null)[]>([]);
  const pinRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  /* On a phone each step is exactly as tall as the room left under the
     pinned plate, so one step fills the view at a time instead of the
     tail of one and the head of the next sharing it.               */
  useEffect(() => {
    const pin = pinRef.current;
    const root = rootRef.current;
    if (!pin || !root) return;
    const ro = new ResizeObserver(() => root.style.setProperty("--pin-h", `${pin.offsetHeight}px`));
    ro.observe(pin);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    let io: IntersectionObserver | null = null;
    const watch = () => {
      io?.disconnect();
      // wide: the middle of the screen. narrow: the middle of the room under the plate,
      // which is where a step sits once it fills that room
      const wide = window.matchMedia("(min-width: 1024px)").matches;
      io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) if (e.isIntersecting) setStep(Number((e.target as HTMLElement).dataset.step));
        },
        { rootMargin: wide ? "-50% 0px -50% 0px" : "-72% 0px -27% 0px" },
      );
      refs.current.forEach((el) => el && io!.observe(el));
    };
    watch();
    const mq = window.matchMedia("(min-width: 1024px)");
    mq.addEventListener("change", watch);
    return () => {
      io?.disconnect();
      mq.removeEventListener("change", watch);
    };
  }, []);

  return (
    <div ref={rootRef} className="relative lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
      <div
        ref={pinRef}
        className="sticky top-[var(--site-header-h,0px)] z-10 -mx-4 bg-page px-4 pb-3 pt-3 transition-[top] duration-[420ms] ease-[var(--ease-out-soft)] sm:-mx-6 sm:px-6 lg:order-2 lg:mx-0 lg:h-[78vh] lg:min-h-[580px] lg:self-start lg:bg-transparent lg:p-0 lg:transition-none lg:top-[11vh]"
      >
        <Plate step={step} />
        {/* on a phone, the steps fade out as they slide up under the plate */}
        <span aria-hidden className="pointer-events-none absolute inset-x-0 -bottom-8 h-8 bg-gradient-to-b from-page to-transparent lg:hidden" />
      </div>

      <div className="lg:order-1">
        {steps.map((s, i) => (
          <div
            key={s.title}
            ref={(el) => {
              refs.current[i] = el;
            }}
            data-step={i}
            className={[
              "flex min-h-[calc(100svh-var(--pin-h,50svh))] flex-col justify-center gap-4 py-8 transition-opacity duration-500 lg:min-h-[86vh] lg:py-10 lg:opacity-100",
              // on a phone, only the step being shown is fully there
              step === i ? "opacity-100" : "opacity-[0.18]",
            ].join(" ")}
          >
            <span className="text-[13px] tabular-nums text-ink-faint">
              {String(i + 1).padStart(2, "0")} / {String(steps.length).padStart(2, "0")}
            </span>
            <h3
              className={[
                "max-w-[16ch] text-[clamp(28px,3.6vw,46px)] font-medium leading-[1.04] tracking-[-0.045em] transition-colors duration-500",
                step === i ? "text-ink" : "text-ink-faint",
              ].join(" ")}
            >
              {s.title}
            </h3>
            <p className="max-w-[42ch] text-[16.5px] leading-[1.6] text-ink-body text-pretty">{s.body}</p>
            {/* the plate is short on a phone; its legend lives with the words */}
            <Legend parts={s.parts} className="mt-1 flex-col lg:hidden" />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── The plate ─────────────────────────────────────────────────────── */

/* How wide each step's object is at full size; narrower plates scale it */
const DESIGN_WIDTH = [340, 420, 380, 560];

function Engraved({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[11px] font-medium tracking-[0.06em] text-ink-faint" style={{ textShadow: "var(--emboss-soft)" }}>
      {children}
    </span>
  );
}

function Marker({ n, show, className = "" }: { n: number; show: boolean; className?: string }) {
  return (
    <span
      aria-hidden
      className={["absolute z-10 grid h-6 w-6 place-items-center rounded-full text-[11px] font-semibold tabular-nums text-ink-label", className].join(" ")}
      style={{
        background: "var(--face)",
        boxShadow: "var(--key-shadow)",
        opacity: show ? 1 : 0,
        scale: show ? "1" : "0.6",
        transition: "opacity 300ms ease, scale 400ms var(--ease-spring)",
      }}
    >
      {n}
    </span>
  );
}

/* A specimen plate: the case and plate from the kit's card materials, a
   plan view of the object on a faint grid, a legend for its numbered
   parts (wide screens; on a phone it sits with the words), and a pencil
   section through the same thing underneath.                      */
function Plate({ step }: { step: number }) {
  const apart = step === 1;
  const lighting = step === 2;
  const paired = step === 3;

  const [autoPress, setAutoPress] = useState(false);
  const [held, setHeld] = useState(false);
  const [lamp, setLamp] = useState(0); // -1 far left … 1 far right
  const [typed, setTyped] = useState("");
  const viewRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  // The object scales down to fit a narrow plate
  useEffect(() => {
    const el = viewRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setWidth(e.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const zoom = width ? Math.min(1, (width - 40) / DESIGN_WIDTH[step]) : 1;

  // fig. 1: the key presses itself every so often
  useEffect(() => {
    if (step !== 0 || still()) return;
    let off: ReturnType<typeof setTimeout>;
    const id = setInterval(() => {
      setAutoPress(true);
      off = setTimeout(() => setAutoPress(false), 260);
    }, 1600);
    return () => {
      clearInterval(id);
      clearTimeout(off);
    };
  }, [step]);

  // fig. 3: the lamp swings, and goes back overhead when the step is left
  useEffect(() => {
    let raf = 0;
    if (!lighting || still()) {
      raf = requestAnimationFrame(() => setLamp(lighting ? -0.6 : 0));
      return () => cancelAnimationFrame(raf);
    }
    const t0 = performance.now();
    const tick = (now: number) => {
      setLamp(Math.sin(((now - t0) / 4200) * Math.PI * 2));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [lighting]);

  // fig. 4: an address types itself into the field, rests, and starts over
  useEffect(() => {
    if (!paired) return;
    const word = "ada@example.com";
    if (still()) {
      const raf = requestAnimationFrame(() => setTyped(word));
      return () => cancelAnimationFrame(raf);
    }
    let i = 0;
    const id = setInterval(() => {
      i = i >= word.length + 14 ? 0 : i + 1;
      setTyped(word.slice(0, i));
    }, 90);
    return () => clearInterval(id);
  }, [paired]);

  const pressed = !apart && (held || autoPress);
  const meta = steps[step];
  const lampNow = lighting ? lamp : 0;

  return (
    <figure
      className="m-0 flex h-full flex-col rounded-[26px] p-1.5 sm:rounded-[30px] sm:p-2"
      style={{ background: "var(--card-bezel)", boxShadow: "var(--card-shadow)" }}
      aria-label={`figure ${step + 1}: ${meta.fig}`}
    >
      <div className="flex h-full flex-col overflow-hidden rounded-[21px] sm:rounded-[23px]" style={{ background: "var(--card)", boxShadow: "var(--card-face-shadow)" }}>
        {/* which figure, and where it sits among the four */}
        <div className="flex items-center justify-between px-4 pt-3 sm:px-6 sm:pt-5">
          <Engraved>
            fig. {step + 1} · {meta.fig}
          </Engraved>
          <span className="flex gap-1.5" aria-hidden>
            {steps.map((_, i) => (
              <span
                key={i}
                className="h-1.5 rounded-full transition-[width,background-color] duration-500"
                style={{ width: i === step ? 16 : 6, background: i === step ? "var(--ink-soft)" : "var(--ink-ghost)" }}
              />
            ))}
          </span>
        </div>

        {/* plan view, on a faint grid pressed into the plate */}
        <div
          ref={viewRef}
          className="relative mx-2.5 mt-2.5 flex min-h-[150px] flex-1 items-center justify-center overflow-hidden rounded-[16px] sm:mx-4 sm:mt-3 lg:min-h-[250px]"
          style={{
            background: "radial-gradient(circle, var(--dots) 1px, transparent 1.3px) 0 0 / 18px 18px, var(--well)",
            boxShadow: "var(--well-shadow)",
            perspective: "1400px",
          }}
        >
          <div className="relative flex items-center pt-6" style={{ zoom }}>
            {/* fig. 3's lamp, swinging along its track above the key */}
            <div
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-[-104px] h-[60px] w-[320px] -translate-x-1/2"
              style={{ opacity: lighting ? 1 : 0, transition: "opacity 400ms ease" }}
            >
              <svg viewBox="0 0 320 60" className="absolute inset-0 h-full w-full overflow-visible">
                <path d="M 10 52 Q 160 -18 310 52" fill="none" stroke="var(--ink-ghost)" strokeWidth="1" strokeDasharray="3 5" />
              </svg>
              <span className="absolute -translate-x-1/2" style={{ left: `${50 + lampNow * 44}%`, top: `${40 - (1 - lampNow * lampNow) * 30}px` }}>
                <Lamp lit width={40} />
              </span>
            </div>

            {/* fig. 4's field, sliding in beside the key */}
            <div
              aria-hidden
              className="relative h-[96px]"
              style={{
                width: paired ? 240 : 0,
                marginRight: paired ? 24 : 0,
                opacity: paired ? 1 : 0,
                transition: "width 700ms var(--ease-out-soft), margin 700ms var(--ease-out-soft), opacity 400ms ease",
              }}
            >
              <div className="flex h-full items-center overflow-hidden rounded-[26px]" style={{ background: "var(--field)", boxShadow: "var(--field-shadow)" }}>
                <span className="whitespace-nowrap pl-6 text-[20px] tracking-[-0.01em] text-ink-soft">
                  {typed}
                  <span className="animate-otp-caret ml-px inline-block h-[22px] w-[2px] translate-y-[4px] rounded-full bg-ink" />
                </span>
              </div>
              <Marker n={1} show={paired} className="-left-3 -top-3" />
            </div>

            <Key
              step={step}
              pressed={pressed}
              lamp={lampNow}
              onDown={() => {
                if (apart) return;
                setHeld(true);
                playClick();
              }}
              onUp={() => {
                if (!held) return;
                setHeld(false);
                playClick({ pitch: 1.25, volume: 0.1 });
              }}
              onLeave={() => setHeld(false)}
            />
          </div>
        </div>

        <Legend parts={meta.parts} className="hidden px-6 pt-4 lg:flex" />

        {/* the same object, cut through and drawn by hand */}
        <div className="mt-2.5 border-t px-4 pb-2 pt-2.5 sm:mt-4 sm:px-6 sm:pb-3 sm:pt-3" style={{ borderColor: "var(--divider)" }}>
          <Engraved>section</Engraved>
          <Section step={step} pressed={pressed} lamp={lampNow} />
        </div>
      </div>
    </figure>
  );
}

/* ── The key, in plan ──────────────────────────────────────────────── */

function Key({
  step,
  pressed,
  lamp,
  onDown,
  onUp,
  onLeave,
}: {
  step: number;
  pressed: boolean;
  lamp: number;
  onDown: () => void;
  onUp: () => void;
  onLeave: () => void;
}) {
  const apart = step === 1;
  const lighting = step === 2;
  const z = (layer: number) => (apart ? layer * 64 : 0);
  return (
    <button
      type="button"
      aria-label="press"
      onPointerDown={onDown}
      onPointerUp={onUp}
      onPointerLeave={onLeave}
      className="relative h-[96px] w-[260px] shrink-0 cursor-pointer rounded-[26px] outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
      style={{
        transformStyle: "preserve-3d",
        transform: apart ? "rotateX(54deg) rotateZ(-28deg) scale(0.88)" : "none",
        transition: "transform 1000ms var(--ease-out-soft)",
      }}
    >
      {/* its shadow falls away from the lamp */}
      <span
        aria-hidden
        className="absolute inset-0 rounded-[26px]"
        style={{
          background: "rgba(17,17,17,0.45)",
          filter: apart ? "blur(26px)" : "blur(12px)",
          opacity: apart ? 0.45 : pressed ? 0.16 : 0.32,
          transform: apart ? "translateZ(-40px)" : `translate(${-lamp * 30}px, ${pressed ? 5 : 11}px) scale(0.94)`,
          transition: lighting ? "opacity 160ms ease" : "all 800ms var(--ease-out-soft)",
        }}
      />
      <span
        aria-hidden
        className="absolute inset-0 rounded-[26px]"
        style={{ background: "var(--bezel-dark)", boxShadow: "var(--bezel-dark-shadow)", transform: `translateZ(${z(0)}px)` }}
      >
        <Marker n={apart ? 3 : 2} show={step === 0 || step === 1} className="-bottom-3 -right-3" />
      </span>
      <span
        aria-hidden
        className="absolute inset-[7px] overflow-hidden rounded-[19px]"
        style={{
          background: "var(--face-dark)",
          boxShadow: pressed ? "var(--face-dark-pressed)" : "var(--face-dark-shadow)",
          transform: `translateZ(${z(1)}px) translateY(${pressed ? 1 : 0}px)`,
          transition: "transform 1000ms var(--ease-out-soft), box-shadow 120ms ease",
        }}
      >
        {/* light raking across the face from the lamp's side */}
        <span
          className="absolute inset-0"
          style={{ background: `linear-gradient(${180 + lamp * 55}deg, rgba(255,255,255,${lighting ? 0.2 : 0.06}) 0%, rgba(255,255,255,0) 45%)` }}
        />
      </span>
      <span
        aria-hidden
        className="absolute inset-[7px]"
        style={{ transform: `translateZ(${z(1)}px)`, transition: "transform 1000ms var(--ease-out-soft)" }}
      >
        <Marker n={apart ? 2 : 1} show={step === 0 || step === 1} className="-left-3 -top-3" />
        <Marker n={1} show={lighting} className="-top-3 left-1/2 -ml-3" />
      </span>
      <span
        className="absolute inset-0 flex items-center justify-center text-[21px] font-medium tracking-[-0.02em]"
        style={{
          color: apart ? "var(--ink)" : "#fff",
          fontWeight: apart ? 600 : 500,
          textShadow: apart ? "0 6px 10px rgba(17,17,17,0.18)" : "0 -1px 0 rgba(0,0,0,0.45)",
          transform: `translateZ(${z(2)}px) translateY(${pressed ? 1 : 0}px)`,
          transition: "transform 1000ms var(--ease-out-soft), color 500ms ease, text-shadow 500ms ease",
        }}
      >
        <span className="relative">
          subscribe
          <Marker n={1} show={apart} className="-right-8 -top-2" />
        </span>
      </span>
      <Marker n={2} show={lighting} className="-bottom-8 left-1/2 -ml-3" />
      <Marker n={2} show={step === 3} className="-right-3 -top-3" />
    </button>
  );
}

/* ── The section, in pencil ────────────────────────────────────────── */

const VIEW_X = 80;
const VIEW_W = 520; // the slice of the drawing shown
const GROUND = 98;

function Section({ step, pressed, lamp }: { step: number; pressed: boolean; lamp: number }) {
  const ref = useRef<SVGSVGElement>(null);
  const [width, setWidth] = useState(VIEW_W);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setWidth(e.contentRect.width || VIEW_W));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const clip = `pencil${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;

  /* Notes stay about 15px on screen however small the drawing gets */
  const k = VIEW_W / width;
  const pencil = { fill: "none", stroke: "var(--ink-label)", strokeWidth: 1.1 * Math.max(1, k * 0.8), strokeLinecap: "round", strokeLinejoin: "round" } as const;
  const soft = { ...pencil, stroke: "var(--ink-faint)" } as const;
  const note = { fill: "var(--ink-body)", fontSize: 17 * k, fontFamily: "var(--font-hand), cursive", fontWeight: 600 } as const;
  const show = (i: number) => ({ opacity: step === i ? 1 : 0, transition: "opacity 450ms ease" });

  const cut = step === 3;
  const groundTop = (x: number) => (cut && x > 116 && x < 284 ? GROUND + 16 : GROUND);
  const lampX = 320 + lamp * 170;
  const shadowX = 320 - lamp * 46;

  /* the key in section: a bezel with its face sitting in it */
  const keyAt = (x: number, seed: number, faceDown = 0) => (
    <>
      <path d={box(x, 74, 200, 24, 8, seed)} style={{ ...pencil, fill: "var(--surface-active)" }} />
      <g style={{ transform: `translateY(${faceDown}px)`, transition: "transform 140ms ease" }}>
        <path d={box(x + 12, 63, 176, 22, 7, seed + 11)} style={{ ...pencil, fill: "var(--panel-face)" }} />
      </g>
    </>
  );

  return (
    <svg ref={ref} viewBox={`${VIEW_X} 0 ${VIEW_W} 132`} className="mt-1 block h-auto w-full overflow-visible" role="img" aria-label={`section: ${steps[step].fig}`}>
      <defs>
        <clipPath id={clip}>
          <rect x={VIEW_X} y="0" width={VIEW_W} height="132" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clip})`}>
        {/* the ground, and the pencil shading under it */}
        {cut ? (
          <path
            d={[twice(VIEW_X, GROUND, 116, GROUND, 3), stroke(116, GROUND, 120, 112, 5), twice(122, 114, 278, 114, 7), stroke(280, 112, 284, GROUND, 9), twice(284, GROUND, VIEW_X + VIEW_W, GROUND, 13)].join(" ")}
            style={pencil}
          />
        ) : (
          <path d={twice(VIEW_X, GROUND, VIEW_X + VIEW_W, GROUND, 3)} style={pencil} />
        )}
        <path d={hatch(VIEW_X + 8, VIEW_X + VIEW_W, groundTop, 132, cut ? 21 : 17)} style={{ ...soft, strokeWidth: 0.9 * Math.max(1, k * 0.8) }} />

        {/* fig. 1: the face sinks into the bezel */}
        <g style={show(0)}>
          {keyAt(220, 31, pressed ? 6 : 0)}
          <path d={arrow(448, 58, 448, 92, 0, 41)} style={pencil} />
          <path d={arrow(448, 92, 448, 58, 0, 43)} style={pencil} />
          <text x="458" y="80" style={note}>1px</text>
          <text x="172" y="50" style={note} textAnchor="end">face</text>
          <path d={arrow(176, 46, 238, 64, 30, 45)} style={soft} />
          <text x="168" y="92" style={note} textAnchor="end">bezel</text>
          <path d={arrow(172, 88, 218, 88, -20, 47)} style={soft} />
        </g>

        {/* fig. 2: the three layers, lifted apart along guides */}
        <g style={show(1)}>
          <path d={`${stroke(232, 18, 232, GROUND, 51)} ${stroke(408, 18, 408, GROUND, 53)}`} style={{ ...soft, strokeDasharray: "3 5" }} />
          <path d={box(220, 74, 200, 24, 8, 55)} style={{ ...pencil, fill: "var(--surface-active)" }} />
          <path d={box(232, 40, 176, 20, 7, 57)} style={{ ...pencil, fill: "var(--panel-face)" }} />
          <path d={scribble(320, 15, 74, 5, 59)} style={{ ...pencil, strokeWidth: 2.2 }} />
          <text x="470" y="22" style={note}>label</text>
          <path d={arrow(466, 18, 364, 15, 18, 61)} style={soft} />
          <text x="470" y="56" style={note}>face</text>
          <path d={arrow(466, 52, 412, 50, 14, 63)} style={soft} />
          <text x="470" y="90" style={note}>bezel</text>
          <path d={arrow(466, 86, 424, 86, 12, 65)} style={soft} />
        </g>

        {/* fig. 3: light from wherever the lamp is, shadow on the far side */}
        <g style={show(2)}>
          <path d={scribble(shadowX, GROUND + 3, 190, 3.5, 71)} style={{ ...soft, stroke: "var(--ink-muted)", strokeWidth: 1.4 }} />
          {keyAt(220, 73)}
          <path d={`${stroke(lampX, 18, 236, 62, 75)} ${stroke(lampX, 18, 404, 62, 77)}`} style={{ ...soft, strokeDasharray: "2 6" }} />
          {/* the lamp: a little sun, sketched */}
          <path d={box(lampX - 7, 6, 14, 14, 7, 79)} style={{ ...pencil, fill: "var(--warning)", fillOpacity: 0.55 }} />
          <path
            d={[0, 1, 2, 3, 4, 5].map((i) => {
              const a = (i / 6) * Math.PI * 2;
              return stroke(lampX + Math.cos(a) * 11, 13 + Math.sin(a) * 11, lampX + Math.cos(a) * 15, 13 + Math.sin(a) * 15, 81 + i, 0.4);
            }).join(" ")}
            style={pencil}
          />
          <text x={lampX + 22} y="20" style={note}>lamp</text>
          {/* the edge it lights, gone over hard */}
          <path d={lamp >= 0 ? twice(322, 63, 404, 63, 85) : twice(236, 63, 318, 63, 85)} style={{ ...pencil, stroke: "var(--ink)", strokeWidth: 2.2 }} />
          <text x={shadowX - 150} y="88" style={note} textAnchor="middle">shadow</text>
          <path d={arrow(shadowX - 150, 92, shadowX - 92, 101, -26, 87)} style={soft} />
        </g>

        {/* fig. 4: a field cut into the surface, a key standing on it */}
        <g style={show(3)}>
          <text x="200" y="84" style={note} textAnchor="middle">field, cut in</text>
          <path d={arrow(200, 88, 200, 108, 10, 91)} style={soft} />
          {keyAt(380, 93)}
          <text x="480" y="44" style={note} textAnchor="middle">key, stands up</text>
          <path d={arrow(480, 48, 470, 61, 12, 95)} style={soft} />
        </g>
      </g>
    </svg>
  );
}
