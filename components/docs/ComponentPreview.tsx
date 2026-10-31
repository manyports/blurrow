"use client";

import { Tabs } from "@/components/ui/Tabs";
import { CodeBlock } from "@/components/ui/CodeBlock";

interface ComponentPreviewProps {
  name: string;
  code: string;
  children: React.ReactNode;
  /** Taller stage for components that need room (cards, tables, carousels) */
  size?: "md" | "lg";
}

/* The stage is a panel like the code block beside it: a soft bezel
   holding a face. The face is the page's own grey, so components sit
   on it exactly as they would in an app.                            */
export function ComponentPreview({ name, code, children, size = "md" }: ComponentPreviewProps) {
  return (
    <Tabs
      tabs={[
        {
          key: "preview",
          label: "preview",
          content: (
            <div
              className="rounded-[20px] p-1.5"
              style={{ background: "var(--panel-bezel)", boxShadow: "var(--panel-shadow)" }}
            >
              <div
                className={[
                  "relative rounded-[15px] flex items-center justify-center px-5 py-12 sm:px-10 text-[14px] text-ink",
                  size === "lg" ? "min-h-[420px]" : "min-h-[300px]",
                ].join(" ")}
                style={{
                  background: "var(--page)",
                  boxShadow: "var(--stage-shadow)",
                }}
              >
                {children}
              </div>
            </div>
          ),
        },
        {
          key: "code",
          label: "code",
          content: <CodeBlock language="tsx" title={`${name}.tsx`} code={code} className="text-ink-soft" />,
        },
      ]}
    />
  );
}
