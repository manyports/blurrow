import React from "react";

interface DataListItem {
  label: string;
  value: React.ReactNode;
}

interface DataListProps {
  items: DataListItem[];
  columns?: 1 | 2;
  className?: string;
}

export function DataList({ items, columns = 1, className = "" }: DataListProps) {
  return (
    <div
      className={["rounded-[18px] p-1.5", className].filter(Boolean).join(" ")}
      style={{ background: "var(--panel-bezel)", boxShadow: "var(--panel-shadow)" }}
    >
      <dl
        className={[
          // 1px gaps over a hairline-coloured face draw the grid lines, so
          // borders never double up whatever the item count
          "grid gap-px bg-ink/[0.05] rounded-[13px] overflow-hidden",
          columns === 2 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1",
        ].join(" ")}
        style={{ boxShadow: "var(--panel-face-shadow)" }}
      >
        {items.map((item, i) => (
          <div
            key={i}
            className={[
              "flex flex-col gap-1.5 px-5 py-4 bg-panel-face",
              // An odd last cell in two columns spans the row instead of leaving a hole
              columns === 2 && items.length % 2 === 1 && i === items.length - 1 ? "sm:col-span-2" : "",
            ].join(" ")}
          >
            <dt className="text-[12px] text-ink-muted">
              {item.label}
            </dt>
            <dd className="min-h-6 flex items-center text-[14px] font-medium text-ink tracking-[-0.01em] tabular-nums">
              {item.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
