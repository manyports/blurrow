import React from "react";

type Theme = "light" | "dark";

interface CardShellProps {
  theme?: Theme;
  /** Controls and context: actions, attribution, deltas. Lives on the chassis. */
  rail?: React.ReactNode;
  /** "actions" for buttons; "text" for plain context, indented to the face's text edge */
  railKind?: "actions" | "text";
  as?: "div" | "figure" | "article";
  className?: string;
  faceClassName?: string;
  children: React.ReactNode;
}

/* Every card is built like every other object in the kit: a chassis (bezel)
   holding a face. Content goes on the face; controls and context go on the
   rail, the strip of chassis below it. The two are nearly the same tone —
   the hairline around the face is what separates them.

   Geometry, measured from the card's outer edge:
   - chassis 24px radius, 6px bezel → face 18px radius (concentric)
   - rail content sits 12px in from the left and bottom, 10px below the face
   - a button's label then starts 30px in — the same edge as the face's text,
     and plain-text rails are indented to that edge too                     */
export function CardShell({
  theme = "light",
  rail,
  railKind = "actions",
  as: Tag = "div",
  className = "",
  faceClassName = "",
  children,
}: CardShellProps) {
  const dark = theme === "dark";

  return (
    <Tag
      className={[
        "rim relative m-0 rounded-[24px] p-1.5 flex flex-col h-full",
        rail ? "pb-0" : "",
        className,
      ].join(" ")}
      style={{
        background: dark ? "var(--card-bezel-dark)" : "var(--card-bezel-light)",
        boxShadow: dark ? "var(--card-dark-shadow)" : "var(--card-light-shadow)",
        ["--rim" as string]: dark ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,1)",
      } as React.CSSProperties}
    >
      <div
        className={["relative flex-1 min-h-0 rounded-[18px] overflow-hidden flex flex-col", faceClassName].join(" ")}
        style={{
          background: dark ? "var(--card-dark)" : "var(--card-light)",
          boxShadow: dark ? "var(--card-face-dark-shadow)" : "var(--card-face-light-shadow)",
        }}
      >
        {children}
      </div>

      {rail && (
        <div className="relative shrink-0 px-1.5 pt-2.5 pb-3">
          <div
            className={[
              // 40px = a small button's full height, so text rails and button
              // rails come out the same height and line up across a row
              "min-h-10 flex items-center gap-2 text-[12.5px]",
              railKind === "text" ? "pl-[18px] pr-3 gap-2.5" : "",
              dark ? "text-neutral-400" : "text-neutral-500",
            ].join(" ")}
          >
            {rail}
          </div>
        </div>
      )}
    </Tag>
  );
}
