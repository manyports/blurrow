"use client";

import React, { useState, useRef, useEffect, useLayoutEffect, useId } from "react";

interface Tab {
  key: string;
  label: string;
  content?: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  onChange?: (key: string) => void;
  className?: string;
}

/* A sunken well holding a raised thumb — the same segmented control as
   Pagination. One Tab stop; arrows move between tabs and select them.  */
export function Tabs({ tabs, defaultTab, onChange, className = "" }: TabsProps) {
  const [active, setActive] = useState(defaultTab ?? tabs[0]?.key ?? "");
  const [direction, setDirection] = useState<"left" | "right">("right");
  const [pill, setPill] = useState({ left: 0, width: 0, ready: false });
  const listRef = useRef<HTMLDivElement>(null);
  const btnRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const uid = useId();

  const measurePill = (key: string) => {
    const btn = btnRefs.current[key];
    const list = listRef.current;
    if (!btn || !list) return;
    const lr = list.getBoundingClientRect();
    const br = btn.getBoundingClientRect();
    setPill({ left: br.left - lr.left, width: br.width, ready: true });
  };

  // Before paint, so the thumb is never seen out of place
  useLayoutEffect(() => { measurePill(active); }, [active]);

  useEffect(() => {
    const ro = new ResizeObserver(() => measurePill(active));
    if (listRef.current) ro.observe(listRef.current);
    return () => ro.disconnect();
  }, [active]);

  const handleSelect = (key: string) => {
    const prevIndex = tabs.findIndex((t) => t.key === active);
    const nextIndex = tabs.findIndex((t) => t.key === key);
    setDirection(nextIndex > prevIndex ? "right" : "left");
    setActive(key);
    onChange?.(key);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const i = tabs.findIndex((t) => t.key === active);
    let next = -1;
    if (e.key === "ArrowRight") next = (i + 1) % tabs.length;
    if (e.key === "ArrowLeft") next = (i - 1 + tabs.length) % tabs.length;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = tabs.length - 1;
    if (next < 0) return;
    e.preventDefault();
    const key = tabs[next].key;
    handleSelect(key);
    btnRefs.current[key]?.focus();
  };

  const activeTab = tabs.find((t) => t.key === active);

  return (
    <div className={["flex flex-col gap-4", className].join(" ")}>
      <div
        ref={listRef}
        role="tablist"
        onKeyDown={onKeyDown}
        className="relative flex w-full sm:inline-flex sm:w-auto sm:self-start items-center rounded-[13px] p-1"
        style={{ background: "var(--well)", boxShadow: "var(--well-shadow)" }}
      >
        {pill.ready && (
          <span
            aria-hidden
            className="absolute top-1 bottom-1 rounded-[9px] pointer-events-none"
            style={{
              left: pill.left,
              width: pill.width,
              background: "var(--face-light)",
              boxShadow: "var(--thumb-shadow)",
              transition: "left 300ms var(--ease-spring), width 300ms var(--ease-spring)",
            }}
          />
        )}

        {tabs.map((tab) => {
          const isActive = active === tab.key;
          return (
            <button
              key={tab.key}
              ref={(el) => { btnRefs.current[tab.key] = el; }}
              id={`${uid}-tab-${tab.key}`}
              role="tab"
              type="button"
              aria-selected={isActive}
              aria-controls={tab.content ? `${uid}-panel-${tab.key}` : undefined}
              tabIndex={isActive ? 0 : -1}
              onClick={() => handleSelect(tab.key)}
              className={[
                "relative z-10 flex-1 sm:flex-none px-3.5 py-2 rounded-[9px] text-[13px] font-medium text-center whitespace-nowrap cursor-pointer",
                "transition-colors duration-150",
                "focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-neutral-900",
                isActive ? "text-neutral-900" : "text-neutral-500 hover:text-neutral-800",
              ].join(" ")}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab?.content && (
        <div
          key={active}
          id={`${uid}-panel-${active}`}
          role="tabpanel"
          aria-labelledby={`${uid}-tab-${active}`}
          tabIndex={0}
          className={[
            "text-[13px] text-neutral-600 leading-relaxed rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-900",
            direction === "right" ? "animate-tab-slide-right" : "animate-tab-slide-left",
          ].join(" ")}
        >
          {activeTab.content}
        </div>
      )}
    </div>
  );
}
