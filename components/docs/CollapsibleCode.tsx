"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { CodeBlock } from "@/components/ui/CodeBlock";

/* Long source files start folded so the page stays scannable; the
   copy key still copies the whole file.                           */
export function CollapsibleCode({ title, code, language = "tsx" }: { title: string; code: string; language?: string }) {
  const long = code.split("\n").length > 18;
  const [open, setOpen] = useState(!long);

  return (
    <div className="relative">
      {/* A real overflow clip, so the hidden lines don't keep counting toward
          the page's height. It's padded out past the panel so the side and
          top shadows survive the fold.                                    */}
      <div style={open ? undefined : { maxHeight: 360 + 16, overflow: "hidden", margin: "-16px -16px 0", padding: "16px 16px 0" }}>
        <CodeBlock language={language} title={title} code={code} showLineNumbers />
      </div>
      {long && !open && (
        <div
          className="absolute inset-x-0 bottom-0 h-40 flex items-end justify-center pb-4"
          style={{ background: "linear-gradient(180deg, color-mix(in srgb, var(--page) 0%, transparent) 0%, color-mix(in srgb, var(--page) 90%, transparent) 65%, var(--page) 100%)" }}
        >
          <Button variant="secondary" size="sm" onClick={() => setOpen(true)}>
            show all
          </Button>
        </div>
      )}
      {long && open && (
        <div className="flex justify-center pt-3">
          <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
            fold it back
          </Button>
        </div>
      )}
    </div>
  );
}
