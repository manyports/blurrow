"use client";

import { useEffect, useSyncExternalStore } from "react";
import { applyTheme, readTheme, subscribeTheme, writeTheme, type ThemeChoice } from "@/lib/theme";

const darkQuery = "(prefers-color-scheme: dark)";

function subscribeSystem(cb: () => void) {
  const mq = window.matchMedia(darkQuery);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

/* Whether the page is dark right now: the reader's choice, or the OS
   when they haven't made one. Read-only; useSiteTheme applies it.  */
export function usePageDark() {
  const choice = useSyncExternalStore(subscribeTheme, readTheme, () => "system" as ThemeChoice);
  const systemDark = useSyncExternalStore(
    subscribeSystem,
    () => window.matchMedia(darkQuery).matches,
    () => false,
  );
  return { choice, dark: choice === "dark" || (choice === "system" && systemDark) };
}

/* Keeps <html data-theme> in step with the reader's choice */
export function useSiteTheme() {
  const { choice, dark } = usePageDark();

  useEffect(() => {
    applyTheme(choice);
  }, [choice]);

  const toggle = () => {
    const next: ThemeChoice = dark ? "light" : "dark";
    writeTheme(next);
  };
  return { dark, toggle };
}

function Sun() {
  return (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" viewBox="0 0 24 24" aria-hidden>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function Moon() {
  return (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden>
      <path d="M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5a8.5 8.5 0 1 0 10.7 10.7z" />
    </svg>
  );
}

/* The glyph shows the light you're in; pressing it turns the lamp the
   other way, and the two glyphs swap with a quarter turn.

   On the desktop bar it's a ghost key, like search beside it: quiet
   until you point at it. On mobile it sits with the search and menu
   keys, so it's a small raised key like them.                       */
export function ThemeToggle({ dark, onToggle, variant = "ghost" }: { dark: boolean; onToggle: () => void; variant?: "ghost" | "key" }) {
  const ghost = variant === "ghost";
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={dark ? "switch to light theme" : "switch to dark theme"}
      title={dark ? "light theme" : "dark theme"}
      className={[
        "relative w-9 h-9 flex items-center justify-center cursor-pointer",
        "outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink",
        ghost
          ? "rounded-[11px] text-ink-muted hover:text-ink hover:bg-surface-active/70 hover:[box-shadow:var(--ghost-shadow-hover)] active:[box-shadow:var(--ghost-shadow-pressed)] transition-[background-color,box-shadow,color] duration-150"
          : "rounded-[10px] text-ink-label active:scale-95 transition-[scale] duration-150",
      ].join(" ")}
      style={ghost ? undefined : { background: "var(--face)", boxShadow: "var(--tile-shadow)" }}
    >
      {[false, true].map((isMoon) => (
        <span
          key={String(isMoon)}
          className="absolute inset-0 flex items-center justify-center"
          style={{
            opacity: dark === isMoon ? 1 : 0,
            transform: dark === isMoon ? "none" : `rotate(${isMoon ? -90 : 90}deg) scale(0.6)`,
            transition: "opacity 200ms ease-out, transform 360ms var(--ease-spring)",
          }}
        >
          {isMoon ? <Moon /> : <Sun />}
        </span>
      ))}
    </button>
  );
}
