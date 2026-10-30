"use client";

import React, { useState, useCallback, useRef } from "react";

export interface ReactionItem {
  emoji: string;
  label: string;
  count: number;
  active?: boolean;
}

interface ReactionBarProps {
  reactions?: ReactionItem[];
  className?: string;
}

const defaultReactions: ReactionItem[] = [
  { emoji: "👏", label: "clap", count: 0 },
  { emoji: "❤️", label: "love", count: 0 },
  { emoji: "🔥", label: "fire", count: 0 },
  { emoji: "💡", label: "insightful", count: 0 },
  { emoji: "🎉", label: "celebrate", count: 0 },
];

export function ReactionBar({
  reactions: initialReactions,
  className = "",
}: ReactionBarProps) {
  const [reactions, setReactions] = useState<ReactionItem[]>(
    initialReactions ?? defaultReactions
  );
  const [animatingKey, setAnimatingKey] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleClick = useCallback(
    (index: number) => {
      setReactions((prev) =>
        prev.map((r, i) => {
          if (i !== index) return r;
          return {
            ...r,
            active: !r.active,
            count: r.active ? r.count - 1 : r.count + 1,
          };
        })
      );

      const key = reactions[index].label;
      setAnimatingKey(key);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setAnimatingKey(null), 300);
    },
    [reactions]
  );

  return (
    <div
      className={["flex flex-wrap gap-2", className].filter(Boolean).join(" ")}
    >
      {reactions.map((reaction, index) => {
        const isAnimating = animatingKey === reaction.label;
        return (
          <button
            key={reaction.label}
            type="button"
            onClick={() => handleClick(index)}
            aria-pressed={!!reaction.active}
            aria-label={`${reaction.label}, ${reaction.count}`}
            className={[
              "inline-flex items-center gap-1.5 rounded-[11px] pl-2.5 pr-3 py-[7px] text-[13px] font-medium cursor-pointer",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900",
              reaction.active ? "text-white" : "text-neutral-600 hover:text-neutral-900",
            ].join(" ")}
            style={{
              /* Off is a raised face; on is the dark face — pressed in and lit */
              background: reaction.active ? "var(--face-dark)" : "var(--face-light)",
              boxShadow: reaction.active ? "var(--face-dark-shadow)" : "var(--face-light-shadow)",
              textShadow: reaction.active ? "0 -1px 0 rgba(0,0,0,0.4)" : "0 1px 0 rgba(255,255,255,0.9)",
              transform: isAnimating ? "scale(1.08)" : "scale(1)",
              transition:
                "transform 250ms var(--ease-spring), color 200ms ease, box-shadow 200ms ease",
            }}
          >
            <span aria-hidden className="text-[15px] leading-none">{reaction.emoji}</span>
            <span
              className="tabular-nums leading-none"
              style={{
                transform: isAnimating ? "scale(1.15)" : "scale(1)",
                display: "inline-block",
                transition:
                  "transform 250ms cubic-bezier(0.34, 1.4, 0.64, 1)",
              }}
            >
              {reaction.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
