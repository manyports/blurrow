"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { npmUrl, repo } from "@/lib/site";
import { playClick } from "./click";

function Star({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2.8l2.83 5.74 6.33.92-4.58 4.46 1.08 6.3L12 17.25l-5.66 2.97 1.08-6.3L2.84 9.46l6.33-.92L12 2.8z" />
    </svg>
  );
}

/* Lettering pressed into the plate, as on the instrument at the top */
function Engraved({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[11px] font-medium tracking-[0.06em] text-ink-faint" style={{ textShadow: "var(--emboss-soft)" }}>
      {children}
    </span>
  );
}

const CELL_H = 64;

/* A mechanical counter: each digit sits in its own sunken window on a
   strip of 0–9, and the strips roll to the count the first time the
   counter is seen, the far-right wheel travelling last.            */
function Odometer({ value }: { value: number | null }) {
  const ref = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setSeen(true), { threshold: 0.6 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // as many windows as the count needs, and one more resting at zero, so
  // it reads as a counter without shouting how far it has to go
  const count = String(value ?? 0);
  const digits = count.padStart(count.length + 1, "0").split("").map(Number);
  const firstSignificant = digits.findIndex((d) => d !== 0);

  return (
    <div ref={ref} role="img" aria-label={`${value ?? 0} stars`} className="flex gap-1.5">
      {digits.map((d, i) => (
        <span
          key={i}
          className="relative block w-[46px] overflow-hidden rounded-[11px]"
          style={{ height: CELL_H, background: "var(--field)", boxShadow: "var(--field-shadow)" }}
        >
          <span
            className="absolute inset-x-0 top-0 flex flex-col"
            style={{
              transform: `translateY(${-(seen ? d : 0) * CELL_H}px)`,
              transition: `transform 1400ms cubic-bezier(0.2, 0.9, 0.25, 1) ${i * 140}ms`,
            }}
          >
            {Array.from({ length: 10 }, (_, n) => (
              <span
                key={n}
                className={[
                  "grid shrink-0 place-items-center text-[30px] font-medium tabular-nums tracking-[-0.02em]",
                  // the zeros in front of the count are quieter than the count
                  firstSignificant < 0 || i < firstSignificant ? "text-ink-ghost" : "text-ink",
                ].join(" ")}
                style={{ height: CELL_H }}
              >
                {n}
              </span>
            ))}
          </span>
          {/* glass over the window: a little light at the top, shade at the foot */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0) 70%, rgba(0,0,0,0.06) 100%)" }}
          />
        </span>
      ))}
    </div>
  );
}

function StarKey() {
  const [pressed, setPressed] = useState(false);
  return (
    <a
      href={repo.url}
      target="_blank"
      rel="noopener"
      aria-label="star blurrow on github"
      onPointerDown={() => {
        setPressed(true);
        playClick({ pitch: 1.1, volume: 0.12 });
      }}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      className="group block rounded-[18px] p-[3px] outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
      style={{ background: "var(--bezel)", boxShadow: "var(--bezel-shadow)" }}
    >
      <span
        className="flex h-[58px] items-center gap-2.5 rounded-[15px] px-5 text-[15px] font-medium text-ink transition-[box-shadow,transform] duration-150"
        style={{
          background: "var(--face)",
          boxShadow: pressed ? "var(--face-pressed)" : "var(--face-shadow)",
          transform: pressed ? "translateY(1px)" : "none",
          textShadow: "var(--emboss)",
        }}
      >
        <span className="text-amber-500 transition-[filter,transform] duration-300 ease-[var(--ease-spring)] group-hover:scale-110 group-hover:[filter:drop-shadow(0_0_6px_rgba(245,158,11,0.55))]">
          <Star size={18} />
        </span>
        star it
      </span>
    </a>
  );
}

/* A few parts people might want, to start from instead of a blank field */
const suggestions = ["a stepper", "a kanban board", "a rich text toolbar", "a calendar heatmap"];

/* A small raised key that drops its words into the field */
function SuggestionKey({ label, onPick }: { label: string; onPick: () => void }) {
  const [pressed, setPressed] = useState(false);
  return (
    <button
      type="button"
      onClick={onPick}
      onPointerDown={() => {
        setPressed(true);
        playClick({ pitch: 1.3, volume: 0.07 });
      }}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      className="h-8 cursor-pointer rounded-[10px] px-3 text-[12.5px] font-medium text-ink-label transition-[box-shadow,transform,color] duration-150 hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
      style={{
        background: "var(--face)",
        boxShadow: pressed ? "var(--face-pressed)" : "var(--key-shadow)",
        transform: pressed ? "translateY(1px)" : "none",
      }}
    >
      {label}
    </button>
  );
}

/* Built the way the hero is: the words on the page's left edge, and under
   them one object made of the kit's parts. Two modules on one plate:
   asking for a part, and the stars, on a counter that rolls.      */
export function OpenSource({ stars }: { stars: number | null }) {
  const [idea, setIdea] = useState("");

  const send = () => {
    if (!idea.trim()) {
      document.getElementById("blurrow-idea")?.focus();
      return;
    }
    const params = new URLSearchParams({ title: idea.trim(), body: "_sent from blurrow.org_" });
    window.open(`${repo.url}/issues/new?${params}`, "_blank", "noopener");
  };

  const footLink = "underline decoration-ink-ghost underline-offset-[3px] transition-colors hover:text-ink-body";

  return (
    <section className="flex flex-col">
      <h2 className="text-[clamp(36px,5vw,64px)] font-medium leading-[1] tracking-[-0.05em] text-neutral-900">
        tell me what to build next.
      </h2>
      <p className="mt-6 max-w-[46ch] text-[17px] leading-[1.6] text-neutral-600 text-pretty">
        if a part you need is missing, or one of them feels off, write it below. it opens as an issue on github with
        your words as its title.
      </p>

      <div className="mt-14 rounded-[36px] p-2 sm:mt-16 sm:p-2.5" style={{ background: "var(--card-bezel)", boxShadow: "var(--card-shadow)" }}>
        <div className="rounded-[29px]" style={{ background: "var(--card)", boxShadow: "var(--card-face-shadow)" }}>
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
            {/* ── asking for a part ── */}
            <form
              aria-label="request a part"
              className="flex flex-col gap-5 p-5 sm:p-7"
              onSubmit={(e) => {
                e.preventDefault();
                send();
              }}
            >
              <div className="flex items-center justify-between gap-4">
                <Engraved>request a part</Engraved>
                <Engraved>opens on github</Engraved>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="min-w-0 flex-1">
                  <Input
                    id="blurrow-idea"
                    layered
                    aria-label="what should blurrow have?"
                    placeholder="a stepper for checkout flows"
                    value={idea}
                    onChange={(e) => setIdea(e.target.value)}
                    maxLength={120}
                    fullWidth
                  />
                </div>
                <Button type="submit" size="lg">
                  send
                </Button>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="mr-1 text-[12.5px] text-ink-muted">or start from</span>
                {suggestions.map((sug) => (
                  <SuggestionKey
                    key={sug}
                    label={sug}
                    onPick={() => {
                      setIdea(sug);
                      document.getElementById("blurrow-idea")?.focus();
                    }}
                  />
                ))}
              </div>
            </form>

            {/* ── the stars ── */}
            <div className="flex flex-col gap-5 border-t p-5 sm:p-7 lg:border-l lg:border-t-0" style={{ borderColor: "var(--divider)" }}>
              <div className="flex items-center justify-between gap-4">
                <Engraved>stars on github</Engraved>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <Odometer value={stars} />
                <StarKey />
              </div>
              <p className="text-[12.5px] leading-[1.5] text-ink-muted">a star is how other people find blurrow, and it tells me to keep going.</p>
            </div>
          </div>

          {/* the foot of the plate */}
          <div className="border-t px-5 py-3.5 text-[11px] font-medium tracking-[0.06em] text-ink-faint sm:px-7" style={{ borderColor: "var(--divider)", textShadow: "var(--emboss-soft)" }}>
            <a href={`${repo.url}/blob/main/CONTRIBUTING.md`} target="_blank" rel="noopener" className={footLink}>
              how to contribute
            </a>{" "}
            ·{" "}
            <a href={npmUrl} target="_blank" rel="noopener" className={footLink}>
              npm
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
