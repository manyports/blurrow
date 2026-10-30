"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { CommandPalette } from "@/components/ui/CommandPalette";
import { Kbd } from "@/components/ui/Kbd";

export default function CommandPaletteDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="secondary" size="sm" onClick={() => setOpen(true)}>
        Open palette <Kbd className="ml-1">⌘j</Kbd>
      </Button>
      <CommandPalette
        open={open}
        onClose={() => setOpen(false)}
        sections={[
          {
            title: "actions",
            items: [
              { key: "new", label: "create new post", shortcut: "⌘n" },
              { key: "search", label: "search posts…", shortcut: "⌘f" },
            ],
          },
          {
            title: "settings",
            items: [
              { key: "profile", label: "profile" },
              { key: "billing", label: "billing" },
              { key: "appearance", label: "appearance" },
            ],
          },
        ]}
      />
    </>
  );
}
