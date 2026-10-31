import React from "react";
import { CardShell } from "./CardShell";

interface QuoteCardProps {
  quote: string;
  author: string;
  role?: string;
  avatarSrc?: string;
  theme?: "light" | "dark";
  className?: string;
}

/* Built on CardShell: the quote owns the face; who said it sits on the rail,
   so a stretched card grows the face instead of opening a gap mid-card. */
export function QuoteCard({
  quote,
  author,
  role,
  avatarSrc,
  theme = "light",
  className = "",
}: QuoteCardProps) {
  const dark = theme === "dark";
  // Handles like "@name" shouldn't render an "@" monogram
  const initial = (author.match(/[\p{L}\p{N}]/u)?.[0] ?? "?").toLowerCase();

  const rail = (
    <figcaption className="flex items-center gap-2.5 min-w-0">
      {avatarSrc ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={avatarSrc}
          alt=""
          loading="lazy"
          className="w-7 h-7 rounded-full object-cover shrink-0"
          style={{ boxShadow: dark ? "0 0 0 0.5px var(--photo-edge-dark)" : "0 0 0 0.5px var(--photo-edge)" }}
        />
      ) : (
        <span
          aria-hidden
          className={[
            "w-7 h-7 rounded-full flex items-center justify-center text-[11.5px] font-semibold shrink-0",
            dark ? "text-white" : "text-ink-label",
          ].join(" ")}
          style={{
            background: dark ? "var(--tile-dark)" : "var(--tile)",
            boxShadow: dark ? "var(--tile-dark-shadow)" : "var(--tile-shadow)",
          }}
        >
          {initial}
        </span>
      )}
      <span className="min-w-0 truncate">
        <cite
          className={[
            "not-italic font-semibold tracking-[-0.008em]",
            dark ? "text-white" : "text-ink",
          ].join(" ")}
        >
          {author}
        </cite>
        {role && <span> · {role}</span>}
      </span>
    </figcaption>
  );

  return (
    <CardShell as="figure" theme={theme} className={className} rail={rail} railKind="text">
      <div className="flex-1 flex flex-col p-8">
        <svg
          aria-hidden
          width="22"
          height="17"
          viewBox="0 0 56 44"
          className={["shrink-0 mb-auto", dark ? "text-white/25" : "text-ink-ghost"].join(" ")}
        >
          <path
            fill="currentColor"
            d="M0 44V27.5C0 12.6 7.4 3.4 22.2 0l2.6 6.2C16.9 8.7 13 13.7 12.6 21H24v23H0zm32 0V27.5C32 12.6 39.4 3.4 54.2 0l2.6 6.2C48.9 8.7 45 13.7 44.6 21H56v23H32z"
          />
        </svg>
        <blockquote
          className={[
            "m-0 pt-8 text-[19px] leading-[1.55] tracking-[-0.015em] text-pretty",
            dark ? "text-neutral-50" : "text-ink",
          ].join(" ")}
        >
          {quote}
        </blockquote>
      </div>
    </CardShell>
  );
}
