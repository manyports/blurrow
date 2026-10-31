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
      className={`inline-flex items-center justify-center min-w-[22px] h-[22px] px-1.5 rounded-md text-[11px] font-semibold text-ink-muted ${className}`}
      style={{
        /* A keycap: lit top, solid 1.5px skirt below so it reads as pressable */
        background: "var(--face)",
        boxShadow: "var(--key-shadow)",
        textShadow: "var(--emboss)",
      }}
    >
      {children}
    </kbd>
  );
}
