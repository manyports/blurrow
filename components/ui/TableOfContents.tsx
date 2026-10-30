"use client";

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";

export interface TocItem {
  key: string;
  label: string;
  level: 1 | 2 | 3;
}

interface TableOfContentsProps {
  items: TocItem[];
  activeKey?: string;
  defaultActiveKey?: string;
  onSelect?: (key: string) => void;
  className?: string;
}

const indent: Record<1 | 2 | 3, number> = { 1: 16, 2: 28, 3: 40 };

/* A hairline track runs down the left edge; a slim dark marker glides
   along it to the active heading. Nothing else moves — the active label
   just darkens.                                                       */
export function TableOfContents({
  items,
  activeKey,
  defaultActiveKey,
  onSelect,
  className = "",
}: TableOfContentsProps) {
  const [internal, setInternal] = useState(defaultActiveKey ?? items[0]?.key ?? "");
  const current = activeKey !== undefined ? activeKey : internal;
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [marker, setMarker] = useState<{ top: number; height: number } | null>(null);
  const [ready, setReady] = useState(false);

  const measure = () => {
    const el = refs.current[current];
    setMarker(el ? { top: el.offsetTop, height: el.offsetHeight } : null);
  };

  useLayoutEffect(() => {
    measure();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current]);

  useEffect(() => {
    // Only animate moves after the first placement
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const handleSelect = (key: string) => {
    setInternal(key);
    onSelect?.(key);
  };

  const slide = ready ? "top 360ms var(--ease-out-soft), height 360ms var(--ease-out-soft)" : "none";

  return (
    <nav
      aria-label="On this page"
      className={["rounded-[18px] p-1.5", className].filter(Boolean).join(" ")}
      style={{ background: "var(--panel-bezel)", boxShadow: "var(--panel-shadow)" }}
    >
      <div
        className="bg-white rounded-[13px] px-5 pt-4 pb-4"
        style={{ boxShadow: "var(--panel-face-shadow)" }}
      >
        <p aria-hidden className="text-[12px] font-medium text-neutral-400 mb-3">
          on this page
        </p>

        <div className="relative">
          <span aria-hidden className="absolute left-0 top-0 bottom-0 w-px bg-neutral-900/[0.08]" />
          {marker && (
            <span
              aria-hidden
              className="absolute -left-[0.5px] w-[2px] rounded-full bg-neutral-900"
              style={{ top: marker.top + 6, height: marker.height - 12, transition: slide }}
            />
          )}

          {items.map((item) => {
            const isActive = current === item.key;
            return (
              <button
                key={item.key}
                ref={(el) => {
                  refs.current[item.key] = el;
                }}
                type="button"
                onClick={() => handleSelect(item.key)}
                aria-current={isActive ? "location" : undefined}
                className={[
                  // Weight stays fixed so the active item doesn't reflow its line
                  "relative block w-full text-left py-1.5 text-[13px] leading-5 rounded-[6px] cursor-pointer",
                  "transition-colors duration-200 outline-none",
                  "focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-neutral-900",
                  isActive
                    ? "text-neutral-900 font-medium"
                    : item.level === 1
                      ? "text-neutral-600 hover:text-neutral-900"
                      : "text-neutral-400 hover:text-neutral-700",
                ].join(" ")}
                style={{ paddingLeft: indent[item.level] }}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
