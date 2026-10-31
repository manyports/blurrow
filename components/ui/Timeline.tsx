import React from "react";

type TimelineVariant = "default" | "success" | "warning" | "accent";

interface TimelineItem {
  key: string;
  title: string;
  description?: string;
  date?: string;
  icon?: React.ReactNode;
  variant?: TimelineVariant;
}

interface TimelineProps {
  items: TimelineItem[];
  className?: string;
}

/* Each event is a small raised node with a lit dot, like an indicator
   lamp; the variant only changes the lamp's colour. Nodes are joined by
   one continuous groove, and titles sit on the node's centre line.     */
const lamp: Record<TimelineVariant, string> = {
  default: "var(--lamp-default)",
  success: "var(--lamp-success)",
  warning: "var(--lamp-warning)",
  accent: "var(--lamp-accent)",
};

const iconText: Record<TimelineVariant, string> = {
  default: "text-ink-body",
  success: "text-success-soft",
  warning: "text-warning",
  accent: "text-accent-soft",
};

export function Timeline({ items, className = "" }: TimelineProps) {
  return (
    <div
      className={["rounded-[18px] p-1.5", className].filter(Boolean).join(" ")}
      style={{ background: "var(--panel-bezel)", boxShadow: "var(--panel-shadow)" }}
    >
      <ol
        className="bg-panel-face rounded-[13px] px-5 py-5 flex flex-col"
        style={{ boxShadow: "var(--panel-face-shadow)" }}
      >
        {items.map((item, index) => {
          const variant = item.variant ?? "default";
          const isLast = index === items.length - 1;

          return (
            <li key={item.key} className={["relative flex gap-4", isLast ? "" : "pb-6"].join(" ")}>
              {!isLast && (
                <span
                  aria-hidden
                  className="absolute left-[11px] top-[30px] bottom-[6px] w-[2px] rounded-full"
                  style={{ background: "var(--well)", boxShadow: "var(--well-shadow)" }}
                />
              )}

              <span
                aria-hidden
                className={[
                  "relative w-6 h-6 rounded-full flex items-center justify-center shrink-0",
                  iconText[variant],
                ].join(" ")}
                style={{ background: "var(--face)", boxShadow: "var(--tile-shadow)" }}
              >
                {item.icon ?? (
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{
                      background: lamp[variant],
                      boxShadow: `0 0 6px color-mix(in srgb, ${lamp[variant]} 40%, transparent), var(--lamp-lip)`,
                    }}
                  />
                )}
              </span>

              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-3">
                  <p className="text-[13.5px] font-medium text-ink leading-6 tracking-[-0.005em]">
                    {item.title}
                  </p>
                  {item.date && (
                    <time className="text-[12px] text-ink-faint tabular-nums shrink-0">
                      {item.date}
                    </time>
                  )}
                </div>
                {item.description && (
                  <p className="text-[13px] text-ink-muted leading-relaxed mt-0.5">
                    {item.description}
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
