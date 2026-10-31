"use client";

import { useEffect, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { applyTheme, readTheme, subscribeTheme, writeTheme, type ThemeChoice } from "@/lib/theme";

const darkQuery = "(prefers-color-scheme: dark)";

function subscribeSystem(cb: () => void) {
  const mq = window.matchMedia(darkQuery);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

/* Keeps <html data-theme> in step with the page: the docs follow the
   reader's choice, the landing page stays lit by its own lamp.      */
export function useSiteTheme() {
  const pathname = usePathname();
  const choice = useSyncExternalStore(subscribeTheme, readTheme, () => "system" as ThemeChoice);
  const systemDark = useSyncExternalStore(
    subscribeSystem,
    () => window.matchMedia(darkQuery).matches,
    () => false,
  );

  useEffect(() => {
    applyTheme(choice, pathname);
  }, [choice, pathname]);

  const dark = choice === "dark" || (choice === "system" && systemDark);
  const toggle = () => {
    const next: ThemeChoice = dark ? "light" : "dark";
    writeTheme(next);
  };
  return { dark, toggle };
}

function Sun() {
  return (
    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24" aria-hidden>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function Moon() {
  return (
    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden>
      <path d="M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5a8.5 8.5 0 1 0 10.7 10.7z" />
    </svg>
  );
}

/* A small raised key, like the star beside it. The glyph shows the light
   you're in; pressing it turns the lamp the other way, and the two glyphs
   swap with a quarter turn.                                           */
export function ThemeToggle({ dark, onToggle, className = "" }: { dark: boolean; onToggle: () => void; className?: string }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={dark ? "switch to light theme" : "switch to dark theme"}
      title={dark ? "light theme" : "dark theme"}
      className={[
        "relative w-9 h-9 rounded-[11px] flex items-center justify-center text-ink-label hover:text-ink cursor-pointer",
        "transition-[color,scale] duration-150 active:scale-95",
        "outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink",
        className,
      ].join(" ")}
      style={{ background: "var(--face)", boxShadow: "var(--tile-shadow)" }}
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
