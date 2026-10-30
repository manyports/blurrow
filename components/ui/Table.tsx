import React from "react";

interface Column<T> {
  key: keyof T | string;
  label: string;
  align?: "left" | "right" | "center";
  render?: (value: unknown, row: T) => React.ReactNode;
  width?: string;
}

interface TableProps<T extends Record<string, unknown>> {
  columns: Column<T>[];
  rows: T[];
  title?: string;
  description?: string;
  className?: string;
  onRowClick?: (row: T) => void;
}

const alignClass = (align?: "left" | "right" | "center") =>
  align === "right" ? "text-right" : align === "center" ? "text-center" : "text-left";

/* Title and column headers live in the bezel; rows sit on the raised face. */
export function Table<T extends Record<string, unknown>>({
  columns,
  rows,
  title,
  description,
  className = "",
  onRowClick,
}: TableProps<T>) {
  return (
    <div
      className={["w-full rounded-[18px] p-1.5", title || description ? "pt-0" : "", className].join(" ")}
      style={{ background: "var(--panel-bezel)", boxShadow: "var(--panel-shadow)" }}
    >
      {(title || description) && (
        <div className="px-3.5 pt-3.5 pb-3">
          {title && <p className="text-[13px] font-semibold text-neutral-900 tracking-[-0.01em]">{title}</p>}
          {description && <p className="text-[12px] text-neutral-500 mt-0.5">{description}</p>}
        </div>
      )}

      <div
        className="bg-white rounded-[13px] overflow-x-auto scroll-thin"
        style={{ boxShadow: "var(--panel-face-shadow)" }}
      >
        <table className="w-full text-left border-collapse">
          {title && <caption className="sr-only">{title}</caption>}
          <thead>
            <tr className="border-b border-neutral-100">
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  scope="col"
                  style={col.width ? { width: col.width } : undefined}
                  className={[
                    "px-4 pt-3 pb-2.5 text-[12px] font-medium text-neutral-500 lowercase whitespace-nowrap",
                    alignClass(col.align),
                  ].join(" ")}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr
                key={ri}
                onClick={() => onRowClick?.(row)}
                // Clickable rows are reachable and operable from the keyboard too
                tabIndex={onRowClick ? 0 : undefined}
                onKeyDown={
                  onRowClick
                    ? (e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          onRowClick(row);
                        }
                      }
                    : undefined
                }
                className={[
                  "border-b border-neutral-100 last:border-0 transition-colors duration-100",
                  onRowClick
                    ? "cursor-pointer hover:bg-neutral-50 focus-visible:bg-neutral-50 outline-none focus-visible:shadow-[inset_2px_0_0_#171717]"
                    : "",
                ].join(" ")}
              >
                {columns.map((col, ci) => {
                  const val = row[col.key as keyof T] as unknown;
                  return (
                    <td
                      key={String(col.key)}
                      className={[
                        "px-4 py-3 text-[13px]",
                        ci === 0 ? "font-medium text-neutral-900" : "text-neutral-600 tabular-nums",
                        alignClass(col.align),
                      ].join(" ")}
                    >
                      {col.render ? col.render(val, row) : String(val ?? "")}
                    </td>
                  );
                })}
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-5 py-12 text-center">
                  <p className="text-[13px] font-medium text-neutral-700">nothing here yet</p>
                  <p className="text-[12px] text-neutral-500 mt-0.5">rows will show up here once there are some.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
