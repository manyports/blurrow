"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { playClick } from "./click";

interface Draft {
  id: number;
  title: string;
  fresh?: boolean;
}

/* Type into the sunken field, press the raised button, and the draft
   drops into a sunken tray as a raised card of its own: wells hold
   things, raised things get pressed or picked up.                    */
export function RaisedSunken() {
  const [title, setTitle] = useState("");
  const [drafts, setDrafts] = useState<Draft[]>([
    { id: 2, title: "on building in public" },
    { id: 1, title: "the tools i actually use" },
  ]);
  const nextId = useRef(3);

  const save = () => {
    const id = nextId.current++;
    const t = title.trim() || `untitled ${id - 2}`;
    setDrafts((d) => [{ id, title: t.toLowerCase(), fresh: true }, ...d].slice(0, 3));
    setTitle("");
  };

  // New cards fall into the tray and land with a little bounce
  const drop = (el: HTMLDivElement | null, fresh?: boolean) => {
    if (!el || !fresh || el.dataset.dropped) return;
    el.dataset.dropped = "1";
    el.animate(
      [
        { transform: "translateY(-48px) scale(1.04)", opacity: 0 },
        { transform: "translateY(3px) scale(0.99)", opacity: 1, offset: 0.7 },
        { transform: "none", opacity: 1 },
      ],
      { duration: 520, easing: "cubic-bezier(0.22, 1, 0.36, 1)" },
    );
  };

  return (
    <div
      className="rounded-[24px] p-5 sm:p-8 flex flex-col gap-6"
      style={{
        background: "linear-gradient(180deg, #e9e9e9 0%, #e2e2e2 100%)",
        boxShadow: "inset 0 0 2px rgba(17,17,17,0.12), inset 0 1px 3px rgba(17,17,17,0.06)",
      }}
    >
      <form
        className="flex flex-col sm:flex-row gap-3 sm:items-start"
        onSubmit={(e) => {
          e.preventDefault();
          save();
        }}
      >
        <div className="flex-1 flex flex-col gap-2">
          <Input
            aria-label="draft title"
            placeholder="give your draft a title…"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
          />
          <p className="text-[12px] text-neutral-500 pl-1">sunken, so you type into it</p>
        </div>
        <div className="flex flex-col gap-2 items-start">
          <Button
            type="submit"
            variant="primary"
            onPointerDown={() => playClick()}
            onPointerUp={() => playClick({ pitch: 1.25, volume: 0.1 })}
          >
            save draft
          </Button>
          <p className="text-[12px] text-neutral-500 pl-1">raised, so you press it</p>
        </div>
      </form>

      <div className="flex flex-col gap-2">
        <p className="text-[12px] text-neutral-500 pl-1">your drafts, resting in a well</p>
        <div
          className="rounded-[18px] p-2.5 flex flex-col gap-2 min-h-[176px]"
          style={{ background: "var(--well)", boxShadow: "var(--well-shadow)" }}
        >
          {drafts.map((d, i) => (
            <div
              key={d.id}
              ref={(el) => drop(el, d.fresh)}
              className="rounded-[12px] px-4 py-3 flex items-center justify-between gap-3"
              style={{ background: "var(--face-light)", boxShadow: "var(--thumb-shadow)" }}
            >
              <span className="text-[14px] font-medium text-neutral-900 truncate">{d.title}</span>
              <span className="text-[12px] text-neutral-400 shrink-0">{d.fresh && i === 0 ? "just now" : "earlier"}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
