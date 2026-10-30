"use client";

import React, { useState, useRef, useEffect, useId } from "react";

interface TagInputProps {
  value?: string[];
  defaultValue?: string[];
  onChange?: (tags: string[]) => void;
  placeholder?: string;
  label?: string;
  hint?: string;
  maxTags?: number;
  fullWidth?: boolean;
  className?: string;
}

interface AnimatedTag {
  text: string;
  state: "entering" | "visible" | "exiting";
}

export function TagInput({
  value,
  defaultValue = [],
  onChange,
  placeholder = "add a tag…",
  label,
  hint,
  maxTags,
  fullWidth = false,
  className = "",
}: TagInputProps) {
  const [internal, setInternal] = useState<string[]>(defaultValue);
  const [input, setInput] = useState("");
  const [animTags, setAnimTags] = useState<AnimatedTag[]>(() =>
    (value ?? defaultValue).map((t) => ({ text: t, state: "visible" as const }))
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const uid = useId();
  const prevValueRef = useRef<string[]>(value ?? defaultValue);

  const tags = value !== undefined ? value : internal;

  useEffect(() => {
    const prev = prevValueRef.current;
    const next = tags;

    const added = next.filter((t) => !prev.includes(t));
    const removed = prev.filter((t) => !next.includes(t));

    if (added.length === 0 && removed.length === 0) return;

    setAnimTags((current) => {
      const updated = current.map((at) =>
        removed.includes(at.text) ? { ...at, state: "exiting" as const } : at
      );
      added.forEach((t) => {
        if (!updated.find((at) => at.text === t)) {
          updated.push({ text: t, state: "entering" });
        }
      });
      return updated;
    });

    if (added.length > 0) {
      requestAnimationFrame(() => {
        setAnimTags((current) =>
          current.map((at) =>
            at.state === "entering" ? { ...at, state: "visible" } : at
          )
        );
      });
    }

    if (removed.length > 0) {
      setTimeout(() => {
        setAnimTags((current) => current.filter((at) => at.state !== "exiting"));
      }, 180);
    }

    prevValueRef.current = next;
  }, [tags]);

  const update = (next: string[]) => {
    setInternal(next);
    onChange?.(next);
  };

  const addTag = (raw: string) => {
    const tag = raw.trim();
    if (!tag || tags.includes(tag)) return;
    if (maxTags && tags.length >= maxTags) return;
    update([...tags, tag]);
    setInput("");
  };

  const removeTag = (index: number) => {
    const tagText = tags[index];
    if (!tagText) return;
    setAnimTags((current) =>
      current.map((at) =>
        at.text === tagText ? { ...at, state: "exiting" as const } : at
      )
    );
    setTimeout(() => {
      update(tags.filter((_, i) => i !== index));
    }, 180);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(input);
    }
    if (e.key === "Backspace" && !input && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  };

  return (
    <div className={["flex flex-col gap-1.5", fullWidth ? "w-full" : ""].join(" ")}>
      {label && (
        <label htmlFor={`${uid}-input`} className="text-[12.5px] font-medium text-neutral-700 tracking-[-0.005em]">
          {label}
        </label>
      )}
      <div
        onClick={() => inputRef.current?.focus()}
        className={[
          "flex flex-wrap items-center gap-1.5 rounded-xl px-3 py-2.5",
          "transition-[box-shadow,background] duration-200 ease-out cursor-text",
          "[background:var(--field)] [box-shadow:var(--field-shadow)]",
          "hover:[background:var(--field-hover)] hover:[box-shadow:var(--field-shadow-hover)]",
          "focus-within:[background:#ffffff] focus-within:[box-shadow:var(--field-shadow-focus)]",
          fullWidth ? "w-full" : "",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {animTags.map((at, i) => (
          <span
            key={at.text}
            className={[
              "inline-flex items-center gap-1 pl-2 pr-1 py-0.5 rounded-[7px] text-[11.5px] font-medium text-neutral-700 select-none",
              "transition-all duration-180 ease-[cubic-bezier(0.34,1.4,0.64,1)]",
              at.state === "entering" ? "opacity-0 scale-75" : "",
              at.state === "visible" ? "opacity-100 scale-100" : "",
              at.state === "exiting" ? "opacity-0 scale-75" : "",
            ].join(" ")}
            style={{
              /* Tags are small raised faces sitting in the sunken field */
              background: "var(--face-light)",
              boxShadow: "var(--face-light-shadow)",
            }}
          >
            {at.text}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                const idx = tags.indexOf(at.text);
                if (idx !== -1) removeTag(idx);
              }}
              aria-label={`Remove ${at.text}`}
              className="w-4 h-4 inline-flex items-center justify-center rounded-[5px] text-neutral-400 hover:text-neutral-900 hover:bg-neutral-900/[0.06] cursor-pointer transition-colors"
            >
              <svg width="8" height="8" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          id={`${uid}-input`}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => { if (input) addTag(input); }}
          placeholder={tags.length === 0 ? placeholder : ""}
          aria-label={label ? undefined : placeholder}
          aria-describedby={hint ? `${uid}-hint` : undefined}
          className="flex-1 min-w-[80px] bg-transparent text-[13.5px] text-neutral-900 placeholder:text-neutral-400 outline-none py-0.5"
        />
      </div>
      {hint && <p id={`${uid}-hint`} className="text-[11.5px] text-neutral-500 mt-0.5">{hint}</p>}
    </div>
  );
}
