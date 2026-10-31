import React from "react";

type AvatarSize = "sm" | "md" | "lg";

interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: AvatarSize;
  className?: string;
}

const sizeStyles: Record<AvatarSize, string> = {
  sm: "w-7 h-7 text-[10px]",
  md: "w-9 h-9 text-[12px]",
  lg: "w-12 h-12 text-[14px]",
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toLowerCase();
}

export function Avatar({
  src,
  alt = "",
  name,
  size = "md",
  className = "",
}: AvatarProps) {
  const initials = name ? getInitials(name) : "?";

  return (
    <div
      className={[
        "relative shrink-0 rounded-full overflow-hidden flex items-center justify-center font-semibold text-ink-body select-none",
        sizeStyles[size],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={{ background: "var(--face)" }}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt || name || ""} loading="lazy" className="w-full h-full object-cover" />
      ) : (
        <span role="img" aria-label={name ?? "Unknown"}>{initials}</span>
      )}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-full"
        style={{
          boxShadow: "var(--avatar-rim)",
        }}
      />
    </div>
  );
}

interface AvatarGroupProps {
  children: React.ReactNode;
  max?: number;
  size?: AvatarSize;
  className?: string;
}

const overlapStyles: Record<AvatarSize, string> = {
  sm: "-ml-2",
  md: "-ml-2.5",
  lg: "-ml-3",
};

export function AvatarGroup({
  children,
  max = 5,
  size = "md",
  className = "",
}: AvatarGroupProps) {
  const items = React.Children.toArray(children);
  const visible = items.slice(0, max);
  const overflow = items.length - max;

  return (
    <div className={["flex items-center", className].join(" ")}>
      {visible.map((child, i) => (
        <div
          key={i}
          className={[
            "ring-2 ring-panel-face rounded-full",
            i > 0 ? overlapStyles[size] : "",
          ].join(" ")}
        >
          {child}
        </div>
      ))}
      {overflow > 0 && (
        <div
          className={[
            "ring-2 ring-panel-face rounded-full flex items-center justify-center font-semibold text-ink-body select-none",
            overlapStyles[size],
            sizeStyles[size],
          ].join(" ")}
          style={{ background: "var(--well)", boxShadow: "var(--well-shadow)" }}
          aria-label={`${overflow} more`}
        >
          +{overflow}
        </div>
      )}
    </div>
  );
}
