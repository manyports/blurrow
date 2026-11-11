"use client";

import { useRef, useState } from "react";
import { Input } from "@/components/ui/Input";
import { Slider } from "@/components/ui/Slider";
import { Tabs } from "@/components/ui/Tabs";
import { Toggle } from "@/components/ui/Toggle";
import { usePageDark } from "@/components/docs/ThemeToggle";
import { playClick } from "./click";

/* Eight pads, a major scale from c to c. The click is the kit's own
   synthesised one; pitch moves both its body and its snap.         */
const pads = [
  { note: "c", pitch: 1 },
  { note: "d", pitch: 9 / 8 },
  { note: "e", pitch: 5 / 4 },
  { note: "f", pitch: 4 / 3 },
  { note: "g", pitch: 3 / 2 },
  { note: "a", pitch: 5 / 3 },
  { note: "b", pitch: 15 / 8 },
  { note: "c", pitch: 2 },
];

/* Lettering pressed into the plate, the way a panel is labelled */
function Engraved({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[11px] font-medium tracking-[0.06em] text-ink-faint" style={{ textShadow: "var(--emboss-soft)" }}>
      {children}
    </span>
  );
}

function Pad({ note, lit, onPress }: { note: string; lit: boolean; onPress: () => void }) {
  const [down, setDown] = useState(false);
  return (
    <button
      type="button"
      aria-label={`pad ${note}`}
      onPointerDown={(e) => {
        if (e.button !== 0) return;
        setDown(true);
        onPress();
      }}
      onPointerUp={() => setDown(false)}
      onPointerLeave={() => setDown(false)}
      onKeyDown={(e) => {
        if ((e.key === " " || e.key === "Enter") && !e.repeat) {
          e.preventDefault();
          setDown(true);
          onPress();
        }
      }}
      onKeyUp={() => setDown(false)}
      className="relative aspect-square w-full cursor-pointer rounded-[14px] outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
      style={{
        background: "var(--face)",
        boxShadow: down ? "var(--face-pressed)" : "var(--key-shadow)",
        transform: down ? "translateY(1.5px)" : "none",
        transition: down ? "transform 50ms ease-out, box-shadow 50ms ease-out" : "transform 220ms var(--ease-spring), box-shadow 220ms ease",
      }}
    >
      <span className="absolute bottom-2 left-2.5 text-[11px] font-medium text-ink-faint">{note}</span>
      {/* its indicator light */}
      <span
        aria-hidden
        className="absolute right-2.5 top-2.5 h-[5px] w-[5px] rounded-full"
        style={{
          background: lit ? "#22c55e" : "var(--groove)",
          boxShadow: lit ? "0 0 6px 1px rgba(34,197,94,0.6)" : "inset 0 1px 1px rgba(0,0,0,0.25)",
          transition: lit ? "none" : "background-color 400ms ease, box-shadow 400ms ease",
        }}
      />
    </button>
  );
}

/* The opening's one object: a small instrument, every control on it a
   part from the kit at its real size. Type your name and the screen
   answers, press the pads and they play, flip the finish and the whole
   thing turns into its dark materials.                             */
export function Instrument() {
  const [name, setName] = useState("");
  /* The finish follows the page until you pick one; flipping the
     site's theme hands it back to the page                          */
  const { dark: pageDark } = usePageDark();
  const [picked, setPicked] = useState<boolean | null>(null);
  const [lastPage, setLastPage] = useState(pageDark);
  if (lastPage !== pageDark) {
    setLastPage(pageDark);
    setPicked(null);
  }
  const dark = picked ?? pageDark;
  const [volume, setVolume] = useState(60);
  const [sound, setSound] = useState(true);
  const [lit, setLit] = useState<number | null>(null);
  const [readout, setReadout] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const play = (i: number) => {
    if (sound && volume > 0) playClick({ pitch: pads[i].pitch, volume: (volume / 100) * 0.32 });
    setLit(i);
    setReadout(`${pads[i].note}${i === 7 ? "'" : ""}`);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setLit(null);
      setReadout(null);
    }, 700);
  };

  const greeting = name.trim() ? `hello, ${name.trim().toLowerCase()}.` : "hello.";

  return (
    <div data-theme={picked === null ? undefined : picked ? "dark" : "light"} className="rounded-[36px] p-2 sm:p-2.5" style={{ background: "var(--card-bezel)", boxShadow: "var(--card-shadow)" }}>
      <div className="rounded-[29px]" style={{ background: "var(--card)", boxShadow: "var(--card-face-shadow)" }}>
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,10fr)_minmax(0,11fr)_minmax(0,9fr)]">
          {/* ── screen and the field that writes on it ── */}
          <section aria-label="screen" className="flex flex-col gap-5 p-5 sm:p-7">
            <Engraved>screen</Engraved>
            <div
              aria-live="polite"
              className="relative flex h-[150px] flex-col justify-between overflow-hidden rounded-[16px] px-5 py-4"
              style={{
                background: "linear-gradient(180deg, #0a0a0a 0%, #141414 100%)",
                boxShadow: "inset 0 2px 6px rgba(0,0,0,0.75), inset 0 0 0 1px rgba(0,0,0,0.7), var(--groove-lip-below)",
              }}
            >
              {/* glass: a soft reflection across the top of the screen */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 h-1/2"
                style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0))" }}
              />
              <span className="text-[11px] tracking-[0.06em] text-ink-muted">blurrow · ui-62</span>
              <span className="truncate text-[32px] font-medium leading-none tracking-[-0.04em] text-neutral-100">
                {readout ?? greeting}
              </span>
              <span className="text-[11px] tabular-nums tracking-[0.04em] text-ink-muted">
                vol {sound ? volume : "off"} · {dark ? "dark" : "light"} finish
              </span>
            </div>
            <Input label="your name" placeholder="type it here" value={name} onChange={(e) => setName(e.target.value)} maxLength={18} fullWidth />
          </section>

          {/* ── the pads ── */}
          <section
            aria-label="pads"
            className="flex flex-col gap-5 border-t p-5 sm:p-7 lg:border-l lg:border-t-0"
            style={{ borderColor: "var(--divider)" }}
          >
            <div className="flex items-center justify-between">
              <Engraved>pads</Engraved>
              <span className="text-[11px] text-ink-faint">press them</span>
            </div>
            <div className="grid grid-cols-4 gap-2.5 rounded-[20px] p-2.5" style={{ background: "var(--well)", boxShadow: "var(--well-shadow)" }}>
              {pads.map((p, i) => (
                <Pad key={i} note={p.note} lit={lit === i} onPress={() => play(i)} />
              ))}
            </div>
          </section>

          {/* ── controls ── */}
          <section
            aria-label="controls"
            className="flex flex-col gap-6 border-t p-5 sm:p-7 lg:border-l lg:border-t-0"
            style={{ borderColor: "var(--divider)" }}
          >
            <div className="flex flex-col gap-3">
              <Engraved>finish</Engraved>
              <Tabs
                key={String(pageDark)}
                defaultTab={dark ? "dark" : "light"}
                onChange={(k) => setPicked(k === "dark")}
                tabs={[
                  { key: "light", label: "light" },
                  { key: "dark", label: "dark" },
                ]}
              />
            </div>
            <Slider label="volume" value={volume} onChange={setVolume} showValue />
            <Toggle label="sound" description="the click under every press" checked={sound} onChange={setSound} />
          </section>
        </div>

        {/* the foot of the plate */}
        <div className="border-t px-5 py-3.5 sm:px-7" style={{ borderColor: "var(--divider)" }}>
          <Engraved>every control here is a blurrow component</Engraved>
        </div>
      </div>
    </div>
  );
}
