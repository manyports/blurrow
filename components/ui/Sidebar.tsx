"use client";

import React, { useState, useRef, useEffect, useLayoutEffect } from "react";

interface SidebarItem {
  key: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
  disabled?: boolean;
}

interface SidebarSection {
  title?: string;
  items: SidebarItem[];
}

interface SidebarHeader {
  logo?: React.ReactNode;
  title: string;
  subtitle?: string;
}

interface SidebarProps {
  sections: SidebarSection[];
  header?: SidebarHeader;
  defaultActive?: string;
  active?: string;
  onSelect?: (key: string) => void;
  className?: string;
}

export function Sidebar({
  sections,
  header,
  defaultActive = "",
  active,
  onSelect,
  className = "",
}: SidebarProps) {
  const [internal, setInternal] = useState(defaultActive);
  const current = active !== undefined ? active : internal;
  const [pill, setPill] = useState({ top: 0, height: 0, ready: false });
  const navRef = useRef<HTMLElement>(null);
  const btnRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const measurePill = (key: string) => {
    const btn = btnRefs.current[key];
    const nav = navRef.current;
    if (!btn || !nav) return;
    const nr = nav.getBoundingClientRect();
    const br = btn.getBoundingClientRect();
    setPill({ top: br.top - nr.top, height: br.height, ready: true });
  };

  // Before paint, so the pill is never seen out of place
  useLayoutEffect(() => { measurePill(current); }, [current]);

  useEffect(() => {
    const ro = new ResizeObserver(() => measurePill(current));
    if (navRef.current) ro.observe(navRef.current);
    return () => ro.disconnect();
  }, [current]);

  const handleSelect = (key: string, disabled?: boolean) => {
    if (disabled) return;
    setInternal(key);
    onSelect?.(key);
  };

  return (
    <div
      className={["rounded-[20px] p-1.5", className].join(" ")}
      style={{ background: "var(--panel-bezel)", boxShadow: "var(--panel-shadow)" }}
    >
      <div className="bg-panel-face rounded-[15px] overflow-hidden" style={{ boxShadow: "var(--panel-face-shadow)" }}>
      {header && (
        <div className="px-3 py-3 border-b border-line flex items-center gap-2.5">
          {header.logo && (
            <div
              className="w-7 h-7 rounded-[8px] flex items-center justify-center shrink-0 text-ink-inverse"
              style={{ background: "var(--face-inverse)", boxShadow: "var(--face-inverse-shadow)" }}
            >
              {header.logo}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-semibold text-ink leading-none truncate">{header.title}</p>
            {header.subtitle && (
              <p className="text-[11px] text-ink-faint mt-0.5 leading-none truncate">{header.subtitle}</p>
            )}
          </div>
          <button
            type="button"
            aria-label="Switch workspace"
            className="shrink-0 w-6 h-6 flex items-center justify-center text-ink-faint hover:text-ink transition-colors cursor-pointer rounded-[7px] hover:bg-surface-active"
          >
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l4-4 4 4M8 15l4 4 4-4" />
            </svg>
          </button>
        </div>
      )}

      <nav ref={navRef} aria-label={header?.title ?? "Sidebar"} className="relative p-2 flex flex-col gap-4">
        {pill.ready && (
          <span
            aria-hidden
            className="absolute left-2 right-2 rounded-[11px] pointer-events-none z-0"
            style={{
              top: pill.top,
              height: pill.height,
              background: "var(--face-inverse)",
              boxShadow: "var(--face-inverse-shadow)",
              transition: "top 300ms var(--ease-spring), height 300ms var(--ease-spring)",
            }}
          />
        )}

        {sections.map((section, si) => (
          <div key={si} className="flex flex-col gap-0.5">
            {section.title && (
              <p className="relative z-10 px-2.5 pt-1 pb-1.5 text-[11.5px] font-medium text-ink-faint lowercase">
                {section.title}
              </p>
            )}
            {section.items.map((item) => {
              const isActive = current === item.key;
              return (
                <button
                  key={item.key}
                  ref={(el) => { btnRefs.current[item.key] = el; }}
                  type="button"
                  onClick={() => handleSelect(item.key, item.disabled)}
                  disabled={item.disabled}
                  aria-current={isActive ? "page" : undefined}
                  className={[
                    "relative z-10 w-full flex items-center gap-2.5 px-2.5 py-2 rounded-[11px] text-[13px] font-medium text-left",
                    "transition-colors duration-200 cursor-pointer",
                    "disabled:opacity-35 disabled:pointer-events-none",
                    isActive
                      ? "text-ink-inverse"
                      : "text-ink-body hover:text-ink hover:bg-surface-active/80",
                  ].join(" ")}
                >
                  {item.icon && (
                    <span
                      className={[
                        "shrink-0 w-[22px] h-[22px] rounded-md flex items-center justify-center transition-colors duration-200",
                        isActive
                          ? "bg-ink-inverse/12 shadow-[inset_0_1px_0_var(--inverse-lip)]"
                          : "text-ink-muted [background:var(--face)] [box-shadow:var(--face-shadow)]",
                      ].join(" ")}
                    >
                      {item.icon}
                    </span>
                  )}

                  <span className="flex-1 truncate">{item.label}</span>

                  {item.badge !== undefined && (
                    <span
                      className={[
                        "shrink-0 text-[11px] font-medium px-1.5 py-0.5 rounded-md tabular-nums leading-none transition-colors duration-200",
                        isActive
                          ? "bg-ink-inverse/20 text-ink-inverse/80"
                          : "bg-surface-active text-ink-muted",
                      ].join(" ")}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>
      </div>
    </div>
  );
}
