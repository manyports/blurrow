import { ReactNode } from "react";

export function Kbd({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <kbd
      className={`inline-flex items-center justify-center min-w-[22px] h-[22px] px-1.5 rounded-md text-[11px] font-semibold text-neutral-500 ${className}`}
      style={{
        /* A keycap: lit top, solid 1.5px skirt below so it reads as pressable */
        background: "var(--face-light)",
        boxShadow:
          "0 0 3px rgba(17,17,17,0.136), 0 1.5px 1px rgba(17,17,17,0.12), 0 2px 3px -1px rgba(17,17,17,0.1), inset 0 2px 3px -2px rgba(255,255,255,1)",
        textShadow: "0 1px 0 rgba(255,255,255,0.9)",
      }}
    >
      {children}
    </kbd>
  );
}
