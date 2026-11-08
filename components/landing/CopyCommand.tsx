"use client";

import { useState } from "react";
import { playClick } from "./click";

/* The install command, set into the page like a field (it's text you
   take away, not a thing you press), with a small raised key at its end
   that copies it. Quieter than the primary button beside it on purpose. */
export function CopyCommand({ command, quiet = false }: { command: string; quiet?: boolean }) {
  const [copied, setCopied] = useState(false);
  const [pressed, setPressed] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // clipboard can be refused; the command is still there to select
    }
  };

  /* Beside a primary button it should read as the second choice, not a
     rival: just the command as text, with a small copy mark after it */
  if (quiet) {
    return (
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? "copied" : `copy ${command}`}
        className="group inline-flex h-10 cursor-pointer items-center gap-2.5 whitespace-nowrap rounded-[10px] px-1 font-mono text-[13.5px] text-ink-muted transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
      >
        <span aria-hidden className="text-ink-ghost">$</span>
        {command}
        <span aria-live="polite" className="w-12 text-left font-sans text-[12px] text-ink-faint transition-colors group-hover:text-ink-body">
          {copied ? "copied" : "copy"}
        </span>
      </button>
    );
  }

  return (
    <div
      className="flex h-[52px] items-center gap-3 rounded-[15px] pl-4 pr-1.5"
      style={{ background: "var(--field)", boxShadow: "var(--field-shadow)" }}
    >
      <span aria-hidden className="select-none font-mono text-[13.5px] text-ink-faint">
        $
      </span>
      <code className="flex-1 truncate font-mono text-[13.5px] text-ink-soft">{command}</code>
      <button
        type="button"
        onClick={copy}
        onPointerDown={() => {
          setPressed(true);
          playClick({ pitch: 1.2, volume: 0.08 });
        }}
        onPointerUp={() => setPressed(false)}
        onPointerLeave={() => setPressed(false)}
        aria-label={copied ? "copied" : "copy the install command"}
        className="grid h-10 min-w-10 cursor-pointer place-items-center rounded-[11px] px-3 text-[12.5px] font-medium text-ink-label transition-[box-shadow] duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
        style={{
          background: "var(--face)",
          boxShadow: pressed ? "var(--face-pressed)" : "var(--face-shadow)",
        }}
      >
        <span aria-live="polite">{copied ? "copied" : "copy"}</span>
      </button>
    </div>
  );
}
