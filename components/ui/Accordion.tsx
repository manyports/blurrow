"use client";

import { useState, useCallback, useId, ReactNode } from "react";

interface AccordionItem {
  key: string;
  title: string;
  content: ReactNode;
  defaultOpen?: boolean;
}

interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
  className?: string;
}

export function Accordion({ items, allowMultiple = false, className }: AccordionProps) {
  const [openKeys, setOpenKeys] = useState<Set<string>>(() => {
    const defaults = new Set<string>();
    for (const item of items) {
      if (item.defaultOpen) {
        defaults.add(item.key);
      }
    }
    return defaults;
  });

  const toggle = useCallback(
    (key: string) => {
      setOpenKeys((prev) => {
        const next = new Set(prev);
        if (next.has(key)) {
          next.delete(key);
        } else {
          if (allowMultiple) {
            next.add(key);
          } else {
            next.clear();
            next.add(key);
          }
        }
        return next;
      });
    },
    [allowMultiple]
  );
  const uid = useId();

  return (
    <div
      className={["rounded-[18px] p-1.5", className].filter(Boolean).join(" ")}
      style={{ background: "var(--panel-bezel)", boxShadow: "var(--panel-shadow)" }}
    >
      <div
        className="bg-panel-face rounded-[13px] overflow-hidden p-1"
        style={{ boxShadow: "var(--panel-face-shadow)" }}
      >
        {items.map((item, index) => {
          const isOpen = openKeys.has(item.key);
          const isLast = index === items.length - 1;
          const headerId = `${uid}-${item.key}-header`;
          const panelId = `${uid}-${item.key}-panel`;

          return (
            <div
              key={item.key}
              className={[
                "relative",
                // Hairline between rows, inset so it doesn't touch the rounded corners
                !isLast &&
                  "after:absolute after:left-3 after:right-3 after:bottom-0 after:h-px after:bg-line",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <h3>
                <button
                  type="button"
                  id={headerId}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => toggle(item.key)}
                  className={[
                    "group/acc w-full flex items-center justify-between gap-3 py-3 px-3 text-left text-[13.5px] font-medium cursor-pointer rounded-[10px]",
                    "transition-colors duration-150",
                    isOpen ? "text-ink" : "text-ink-label hover:text-ink hover:bg-surface-hover",
                  ].join(" ")}
                >
                  <span>{item.title}</span>
                  {/* Plus that turns into a minus: says "more inside", not "navigate" */}
                  <span
                    aria-hidden
                    className="relative shrink-0 w-6 h-6 rounded-[7px] flex items-center justify-center text-ink-muted group-hover/acc:text-ink transition-colors"
                    style={{ background: "var(--face)", boxShadow: "var(--face-shadow)" }}
                  >
                    <span className="absolute w-2.5 h-[1.5px] rounded-full bg-current" />
                    <span
                      className="absolute w-2.5 h-[1.5px] rounded-full bg-current"
                      style={{
                        transform: isOpen ? "rotate(0deg)" : "rotate(90deg)",
                        transition: "transform 300ms var(--ease-spring)",
                      }}
                    />
                  </span>
                </button>
              </h3>

              <div
                id={panelId}
                role="region"
                aria-labelledby={headerId}
                // Closed panels are removed from the tab order and the a11y tree
                inert={!isOpen}
                style={{
                  display: "grid",
                  gridTemplateRows: isOpen ? "1fr" : "0fr",
                  transition: "grid-template-rows 320ms var(--ease-out-soft)",
                }}
              >
                <div className="overflow-hidden">
                  <div
                    className="px-3 pb-4 pt-0.5 text-[13px] text-ink-body leading-relaxed"
                    style={{
                      opacity: isOpen ? 1 : 0,
                      transform: isOpen ? "translateY(0)" : "translateY(-4px)",
                      transition: "opacity 240ms ease-out, transform 320ms var(--ease-out-soft)",
                    }}
                  >
                    {item.content}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
