"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { author, pkg } from "@/lib/site";
import { playClick } from "./click";

const columns = [
  {
    title: "docs",
    links: [
      { label: "introduction", href: "/docs" },
      { label: "installation", href: "/docs/installation" },
      { label: "all components", href: "/docs/components" },
    ],
  },
  {
    title: "popular",
    links: [
      { label: "button", href: "/docs/components/button" },
      { label: "input", href: "/docs/components/input" },
      { label: "tabs", href: "/docs/components/tabs" },
      { label: "toast", href: "/docs/components/toast" },
    ],
  },
];

const WORD = "blurrow";

type Hint = "idle" | "typing" | "typo" | "done";

const hints: Record<Hint, string> = {
  idle: "type b-l-u-r-r-o-w",
  typing: "keep going…",
  typo: "oops, a typo. backspace to fix it",
  done: "nicely typed.",
};

/* The wordmark as a row of keycaps, built like the buttons: a bezel
   holding a face that sinks when pressed. While it's on screen you can
   type the word, monkeytype style: letters you haven't reached are dim,
   right ones go black, wrong ones go yellow until you backspace over
   them. Nothing runs until a key is pressed.                         */
function Keycaps() {
  const box = useRef<HTMLDivElement>(null);
  const [typed, setTyped] = useState<string[]>([]);
  const [down, setDown] = useState<boolean[]>(() => WORD.split("").map(() => false));
  const [done, setDone] = useState(false);
  const visible = useRef(false);
  const typedRef = useRef<string[]>([]);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const commit = (next: string[]) => {
    typedRef.current = next;
    setTyped(next);
  };

  const press = (i: number, sound = true) => {
    setDown((d) => d.map((v, j) => (j === i ? true : v)));
    if (sound) playClick({ pitch: 0.9 + i * 0.05, volume: 0.1 });
    timers.current.push(setTimeout(() => setDown((d) => d.map((v, j) => (j === i ? false : v))), 150));
  };

  const finish = () => {
    setDone(true);
    WORD.split("").forEach((_, i) => timers.current.push(setTimeout(() => press(i, i % 2 === 0), 220 + i * 70)));
    timers.current.push(
      setTimeout(() => {
        setDone(false);
        commit([]);
      }, 2600),
    );
  };

  const type = (ch: string) => {
    const t = typedRef.current;
    if (t.length >= WORD.length) return;
    const next = [...t, ch];
    commit(next);
    press(t.length);
    if (next.length === WORD.length && next.join("") === WORD) finish();
  };

  const backspace = () => {
    const t = typedRef.current;
    if (!t.length) return;
    commit(t.slice(0, -1));
    playClick({ pitch: 0.8, volume: 0.07 });
  };

  // Only listen while the row can be seen, so typing elsewhere is left alone
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => (visible.current = e.isIntersecting), { threshold: 0.4 });
    io.observe(el);

    const onKey = (e: KeyboardEvent) => {
      if (!visible.current || e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target as HTMLElement;
      if (target.closest("input, textarea, select, [contenteditable='true']")) return;
      if (e.key === "Backspace") {
        e.preventDefault();
        backspace();
      } else if (e.key === "Escape") {
        commit([]);
      } else if (/^[a-z]$/i.test(e.key) && !e.repeat) {
        type(e.key.toLowerCase());
      }
    };
    window.addEventListener("keydown", onKey);
    const pending = timers.current;
    return () => {
      io.disconnect();
      window.removeEventListener("keydown", onKey);
      pending.forEach(clearTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const typos = typed.filter((c, i) => c !== WORD[i]).length;
  const hint: Hint = done ? "done" : typos ? "typo" : typed.length ? "typing" : "idle";

  // A typing toy needs a keyboard, so phones and small tablets skip it
  return (
    <div ref={box} className="hidden md:flex flex-col items-center gap-4 pt-14 pb-20 overflow-hidden">
      <style href="blurrow-caret" precedence="default">{`
        @keyframes blurrow-caret { 0%, 45% { opacity: 1; } 55%, 100% { opacity: 0; } }
      `}</style>
      <div className="flex gap-[clamp(6px,1.2vw,14px)]" role="img" aria-label={WORD}>
        {WORD.split("").map((ch, i) => {
          const t = typed[i];
          const color = t === undefined ? "#c4c4c4" : t === ch ? "#111111" : "#d99a06";
          const caretHere = !done && i === typed.length;
          return (
            <div key={i} className="relative">
              {caretHere && (
                <span
                  aria-hidden
                  className="absolute top-[18%] bottom-[18%] -left-[clamp(4px,0.7vw,8px)] w-[2px] -translate-x-1/2 rounded-full bg-neutral-900"
                  style={{ animation: "blurrow-caret 1s steps(1) infinite" }}
                />
              )}
              <button
                type="button"
                tabIndex={-1}
                aria-hidden
                onClick={() => type(ch)}
                className="rounded-[clamp(10px,2.2vw,26px)] p-[clamp(3px,0.5vw,6px)] cursor-pointer"
                style={{ background: "var(--bezel-light)", boxShadow: "var(--bezel-light-shadow)" }}
              >
                <span
                  className="flex items-center justify-center w-[clamp(38px,10.5vw,124px)] h-[clamp(38px,10.5vw,124px)] rounded-[clamp(7px,1.7vw,20px)] text-[clamp(20px,5.4vw,64px)] font-semibold tracking-[-0.03em]"
                  style={{
                    color,
                    background: "var(--face-light)",
                    boxShadow: down[i] ? "var(--face-light-pressed)" : "var(--face-light-shadow)",
                    transform: down[i] ? "translateY(1.5px) scale(0.985)" : "none",
                    textShadow: "0 1px 0 rgba(255,255,255,0.9)",
                    transition: down[i]
                      ? "transform 60ms ease-out, box-shadow 60ms ease-out, color 120ms ease"
                      : "transform 220ms var(--ease-spring), box-shadow 220ms ease, color 120ms ease",
                  }}
                >
                  {ch}
                </span>
              </button>
            </div>
          );
        })}
      </div>
      <p
        className={["text-[13px] h-5 transition-colors", hint === "typo" ? "text-amber-600" : hint === "done" ? "text-neutral-900" : "text-neutral-400"].join(" ")}
        aria-live="polite"
      >
        {hints[hint]}
      </p>
    </div>
  );
}

function InstallChip() {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard.writeText(`npm install ${pkg}`).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 1600);
        });
      }}
      className="field self-start h-10 rounded-[12px] px-4 flex items-center gap-3 font-mono text-[13px] text-neutral-700 cursor-pointer"
    >
      <span className="text-neutral-400">$</span>
      npm install {pkg}
      <span className="text-[12px] font-sans text-neutral-400 w-12 text-left">{copied ? "copied!" : "copy"}</span>
    </button>
  );
}

export function Footer() {
  return (
    <footer className="mt-10">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        <div className="pt-14 pb-16 md:pb-0 border-t border-neutral-900/[0.08] grid grid-cols-1 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] gap-12">
          <div className="flex flex-col gap-5">
            <p className="text-[22px] font-medium tracking-[-0.035em] text-neutral-900">
              blurrow<span className="text-neutral-400">/ui</span>
            </p>
            <p className="text-[15px] leading-[1.6] text-neutral-500 max-w-[40ch]">
              made with care by{" "}
              <a href={author.site} target="_blank" rel="noopener" className="link-slide text-neutral-900">
                {author.handle}
              </a>
              . if something feels off, or wonderful, i&apos;d love to hear about it.
            </p>
            <InstallChip />
          </div>
          <div className="grid grid-cols-3 gap-6">
            {columns.map((c) => (
              <nav key={c.title} aria-label={c.title} className="flex flex-col gap-3">
                <p className="text-[13px] text-neutral-400">{c.title}</p>
                {c.links.map((l) => (
                  <Link key={l.href} href={l.href} className="link-slide self-start text-[14px] text-neutral-700 hover:text-neutral-900 transition-colors">
                    {l.label}
                  </Link>
                ))}
              </nav>
            ))}
            <nav aria-label="elsewhere" className="flex flex-col gap-3">
              <p className="text-[13px] text-neutral-400">elsewhere</p>
              <a href={author.site} target="_blank" rel="noopener" className="link-slide self-start text-[14px] text-neutral-700 hover:text-neutral-900 transition-colors">
                {author.siteLabel}
              </a>
            </nav>
          </div>
        </div>

        <Keycaps />
      </div>
    </footer>
  );
}
