"use client";

import { useState } from "react";
import { ContextMenu } from "@/components/ui/ContextMenu";

const icon = (d: string) => (
  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d={d} />
  </svg>
);

export default function ContextMenuDemo() {
  const [last, setLast] = useState<string | null>(null);
  return (
    <ContextMenu
      onSelect={setLast}
      items={[
        { key: "open", label: "open", shortcut: "↵", icon: icon("M14 5h5v5M19 5l-8 8M10 5H6a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1v-4") },
        { key: "rename", label: "rename", shortcut: "F2", icon: icon("M4 20h4L19 9l-4-4L4 16v4z") },
        { key: "duplicate", label: "duplicate", shortcut: "⌘d", icon: icon("M8 8h11v11H8zM5 16V5h11") },
        { key: "d1", label: "", divider: true },
        { key: "delete", label: "delete", danger: true, icon: icon("M5 7h14M10 11v6M14 11v6M6 7l1 12h10l1-12M9 7V4h6v3") },
      ]}
      className="grid h-44 w-72 place-items-center rounded-[16px] text-center"
    >
      <div>
        <p className="text-[13.5px] font-medium text-ink">right-click in here</p>
        <p className="mt-1 text-[12px] text-ink-muted">{last ? `you picked “${last}”` : "or long-press on a phone"}</p>
      </div>
    </ContextMenu>
  );
}
