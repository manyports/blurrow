import React from "react";

export interface ButtonGroupItem {
  label: string;
  content: React.ReactNode;
  onClick?: () => void;
  href?: string;
  /** Sized to its content; otherwise a square key for a lone icon */
  wide?: boolean;
}

interface ButtonGroupProps {
  items: ButtonGroupItem[];
  label: string;
  className?: string;
}

/* One bezel, one face, several keys: a linked control in the same material
   as Button (sm), split by grooves rather than gaps. Each key fills from the
   bottom on hover and sinks when pressed, like a layered Button's face.   */
export function ButtonGroup({ items, label, className = "" }: ButtonGroupProps) {
  return (
    <div
      role="group"
      aria-label={label}
      className={["inline-flex w-fit rounded-[12px] p-[3px]", className].join(" ")}
      style={{ background: "var(--bezel-light)", boxShadow: "var(--bezel-light-shadow)" }}
    >
      <div
        className="flex rounded-[9px] overflow-hidden"
        style={{ background: "var(--face-light)", boxShadow: "var(--face-light-shadow)" }}
      >
        {items.map((item, i) => {
          const keyClass = [
            "group/key relative h-9 inline-flex items-center justify-center gap-1.5 cursor-pointer",
            "text-[13px] font-medium text-neutral-800 outline-none",
            "transition-[box-shadow,background] duration-150",
            "active:bg-neutral-900/[0.04] active:[box-shadow:inset_0_1px_2px_rgba(17,17,17,0.08)]",
            "focus-visible:[box-shadow:inset_0_0_0_2px_rgba(17,17,17,0.85)]",
            item.wide ? "px-4" : "w-10",
          ].join(" ");
          const inner = (
            <>
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 origin-bottom scale-y-0 bg-neutral-900/[0.025] transition-transform duration-300 ease-out group-hover/key:scale-y-100"
              />
              <span className="relative inline-flex items-center gap-1.5">{item.content}</span>
            </>
          );
          const common = {
            "aria-label": item.label,
            title: item.wide ? undefined : item.label,
            className: keyClass,
            style: { textShadow: "0 1px 0 rgba(255,255,255,0.9)" },
          };

          return (
            <React.Fragment key={item.label}>
              {i > 0 && (
                <span
                  aria-hidden
                  className="w-px self-stretch my-2 bg-neutral-900/[0.08]"
                  style={{ boxShadow: "1px 0 0 rgba(255,255,255,0.9)" }}
                />
              )}
              {item.href ? (
                <a href={item.href} {...common}>
                  {inner}
                </a>
              ) : (
                <button type="button" onClick={item.onClick} {...common}>
                  {inner}
                </button>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
