"use client";

import React, {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
  useId,
} from "react";
import { Kbd } from "./Kbd";
import { useModalBehavior } from "./useModalBehavior";

interface CommandItem {
  key: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  shortcut?: string;
  onSelect?: () => void;
}

interface CommandSection {
  title: string;
  items: CommandItem[];
}

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  sections: CommandSection[];
  placeholder?: string;
  className?: string;
}

const CLOSE_MS = 240;

export function CommandPalette({
  open,
  onClose,
  sections,
  placeholder = "search commands…",
  className = "",
}: CommandPaletteProps) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const dialogRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const uid = useId();

  // Filter sections based on query
  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return sections;
    return sections
      .map((section) => ({
        ...section,
        items: section.items.filter(
          (item) =>
            item.label.toLowerCase().includes(q) ||
            item.description?.toLowerCase().includes(q),
        ),
      }))
      .filter((section) => section.items.length > 0);
  }, [sections, query]);

  // Flat list of all visible items for keyboard nav
  const flatItems = useMemo(
    () => filtered.flatMap((s) => s.items),
    [filtered],
  );

  // Mount / unmount lifecycle (matches Modal pattern)
  useEffect(() => {
    if (open) {
      setMounted(true);
      setQuery("");
      setActiveIndex(0);
      return;
    }
    if (mounted) {
      setVisible(false);
      const t = setTimeout(() => setMounted(false), CLOSE_MS);
      return () => clearTimeout(t);
    }
  }, [open, mounted]);

  // Enter animation (matches Modal pattern)
  useLayoutEffect(() => {
    if (!mounted || !open || visible) return;

    const el = dialogRef.current;
    if (el) {
      void el.getBoundingClientRect();
    }

    const id = requestAnimationFrame(() => {
      setVisible(true);
    });
    return () => cancelAnimationFrame(id);
  }, [mounted, open, visible]);

  // Reset active index when filter changes
  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  // Scroll active item into view
  useEffect(() => {
    if (!listRef.current) return;
    const activeEl = listRef.current.querySelector(
      `[data-command-index="${activeIndex}"]`,
    );
    if (activeEl) {
      activeEl.scrollIntoView({ block: "nearest" });
    }
  }, [activeIndex]);

  // Handle selection
  const handleSelect = useCallback(
    (item: CommandItem) => {
      item.onSelect?.();
      onClose();
    },
    [onClose],
  );

  // Keyboard navigation
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setActiveIndex((i) => (i + 1 >= flatItems.length ? 0 : i + 1));
          break;
        case "ArrowUp":
          e.preventDefault();
          setActiveIndex((i) =>
            i - 1 < 0 ? Math.max(flatItems.length - 1, 0) : i - 1,
          );
          break;
        case "Enter":
          e.preventDefault();
          if (flatItems[activeIndex]) {
            handleSelect(flatItems[activeIndex]);
          }
          break;
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose, flatItems, activeIndex, handleSelect]);

  // Escape, focus trap + restore, scroll lock
  useModalBehavior({ open, ready: visible, ref: dialogRef, onClose, initialFocus: inputRef });

  if (!mounted) return null;

  let itemIndex = 0;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[min(20vh,140px)] px-4">
      {/* Backdrop */}
      <div
        className={[
          "absolute inset-0 backdrop-blur-[6px]",
          "transition-opacity ease-out",
          visible ? "opacity-100 duration-300" : "opacity-0 duration-200",
        ].join(" ")}
        style={{ background: "var(--scrim)" }}
        aria-hidden
        onClick={onClose}
      />

      {/* Palette panel */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        className={[
          "relative z-10 w-full max-w-lg rounded-[20px] p-1.5 overflow-hidden",
          "transition-[opacity,transform,scale,translate] ease-[var(--ease-spring)]",
          visible
            ? "opacity-100 scale-100 translate-y-0 duration-300"
            : "opacity-0 scale-[0.94] translate-y-3 duration-200",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        style={{ background: "var(--panel-bezel)", boxShadow: "var(--modal-shadow)" }}
      >
        <div
          className="bg-white rounded-[14px] overflow-hidden"
          style={{ boxShadow: "var(--panel-face-shadow)" }}
        >
          {/* Search input */}
          <div className="flex items-center gap-3 px-4 py-3.5">
            <svg
              className="shrink-0 text-neutral-400"
              width="14"
              height="14"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
              />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={placeholder}
              role="combobox"
              aria-expanded="true"
              aria-controls={`${uid}-list`}
              aria-activedescendant={flatItems[activeIndex] ? `${uid}-item-${activeIndex}` : undefined}
              aria-autocomplete="list"
              className="flex-1 min-w-0 text-[14.5px] font-medium text-neutral-900 placeholder:text-neutral-400 placeholder:font-normal bg-transparent border-none outline-none"
            />
            <Kbd className="shrink-0">esc</Kbd>
          </div>

          {/* Separator */}
          <div className="border-b border-neutral-100" />

          {/* Results */}
          <div
            ref={listRef}
            id={`${uid}-list`}
            role="listbox"
            className="max-h-[340px] overflow-y-auto scroll-thin py-2 px-2"
          >
            {filtered.length === 0 ? (
              <div className="py-10 flex flex-col items-center gap-1 text-center">
                <p className="text-[13px] font-medium text-neutral-700">
                  nothing for &ldquo;{query}&rdquo;
                </p>
                <p className="text-[12px] text-neutral-400">try a shorter or different word.</p>
              </div>
            ) : (
              filtered.map((section, si) => (
                <div key={section.title} role="group" aria-label={section.title} className={si > 0 ? "mt-3" : ""}>
                  <div aria-hidden className="px-3 py-1.5 text-[11.5px] font-medium text-neutral-400 lowercase select-none">
                    {section.title}
                  </div>
                  <div className="flex flex-col gap-0.5">
                    {section.items.map((item) => {
                      const currentIndex = itemIndex++;
                      const isActive = currentIndex === activeIndex;
                      return (
                        <div
                          key={item.key}
                          id={`${uid}-item-${currentIndex}`}
                          role="option"
                          aria-selected={isActive}
                          data-command-index={currentIndex}
                          onClick={() => handleSelect(item)}
                          onMouseMove={() => setActiveIndex(currentIndex)}
                          className={[
                            "group/cmd flex items-center gap-3 w-full text-left px-3 py-2 rounded-[10px] cursor-pointer",
                            "transition-[background,box-shadow] duration-100",
                            isActive ? "bg-neutral-50" : "",
                          ].join(" ")}
                          style={{ boxShadow: isActive ? "var(--panel-face-shadow)" : undefined }}
                        >
                          {item.icon && (
                            <span
                              className={[
                                "shrink-0 w-7 h-7 rounded-[8px] flex items-center justify-center transition-colors duration-100",
                                isActive ? "text-neutral-900" : "text-neutral-500",
                              ].join(" ")}
                              style={{ background: "var(--face-light)", boxShadow: "var(--face-light-shadow)" }}
                            >
                              {item.icon}
                            </span>
                          )}
                          <div className="flex-1 min-w-0 flex flex-col">
                            <span className="text-[13px] font-medium text-neutral-900 truncate">
                              {item.label}
                            </span>
                            {item.description && (
                              <span className="text-[12px] text-neutral-500 truncate">
                                {item.description}
                              </span>
                            )}
                          </div>
                          {item.shortcut && <Kbd className="shrink-0">{item.shortcut}</Kbd>}
                          {!item.shortcut && (
                            <svg
                              aria-hidden
                              width="12"
                              height="12"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              viewBox="0 0 24 24"
                              className={[
                                "shrink-0 text-neutral-400 transition-all duration-150",
                                isActive ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-1",
                              ].join(" ")}
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Key hints — teach the palette while it's open */}
          <div
            className="flex items-center gap-4 px-4 py-2.5 border-t border-neutral-100 text-[11.5px] text-neutral-500 select-none"
            style={{ background: "linear-gradient(180deg, #fcfcfc 0%, #f8f8f8 100%)" }}
          >
            <span className="inline-flex items-center gap-1.5">
              <Kbd>↑</Kbd>
              <Kbd>↓</Kbd>
              Navigate
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Kbd>↵</Kbd>
              Open
            </span>
            <span className="ml-auto tabular-nums text-neutral-400">
              {flatItems.length} {flatItems.length === 1 ? "result" : "results"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
