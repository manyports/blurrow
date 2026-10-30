import React from "react";
import { CardShell } from "./CardShell";

type CardTheme = "light" | "dark";

interface SplitCardProps {
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  image?: React.ReactNode;
  imageSrc?: string;
  imageAlt?: string;
  actions?: React.ReactNode;
  theme?: CardTheme;
  className?: string;
  children?: React.ReactNode;
  layout?: "split";
}

interface StackCardProps {
  title?: string;
  badge?: React.ReactNode;
  subtitle?: string;
  note?: string;
  image?: React.ReactNode;
  imageSrc?: string;
  imageAlt?: string;
  imageBg?: string;
  actions?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
  layout: "stack";
}

type CardProps = SplitCardProps | StackCardProps;

/* Both layouts use CardShell: content on the face, actions on the rail.
   Media sits flush in the face — the face's own corners frame it, so there
   is no box-inside-a-box.                                                 */

function MediaPlaceholder({ dark, bg, monogram }: { dark?: boolean; bg?: string; monogram?: string }) {
  return (
    <div
      className={["relative w-full h-full flex items-center justify-center", bg ?? ""].join(" ")}
      style={bg ? undefined : { background: dark ? "var(--media-well-dark)" : "var(--media-well-light)" }}
    >
      {/* A faint dot grid fading out from the centre: a slot, not a hole */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(${
            bg ? "rgba(255,255,255,0.22)" : dark ? "rgba(255,255,255,0.09)" : "rgba(17,17,17,0.09)"
          } 1px, transparent 1px)`,
          backgroundSize: "12px 12px",
          maskImage: "radial-gradient(70% 70% at 50% 50%, #000 0%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(70% 70% at 50% 50%, #000 0%, transparent 100%)",
        }}
      />
      {/* The title's initial, set huge and barely there and cropped by the
          slot's edges: the empty half carries the card's type, not a glyph */}
      {monogram && (
        <span
          aria-hidden
          className={[
            "absolute -right-3 -bottom-[0.32em] text-[220px] font-semibold leading-none tracking-[-0.06em] select-none",
            dark ? "text-white/[0.045]" : "text-neutral-900/[0.045]",
          ].join(" ")}
        >
          {monogram}
        </span>
      )}
    </div>
  );
}

function Media({
  image,
  imageSrc,
  imageAlt,
  dark,
  bg,
  monogram,
}: {
  image?: React.ReactNode;
  imageSrc?: string;
  imageAlt: string;
  dark?: boolean;
  bg?: string;
  monogram?: string;
}) {
  if (image) return <>{image}</>;
  if (imageSrc) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={imageSrc} alt={imageAlt} loading="lazy" className="w-full h-full object-cover" />;
  }
  return <MediaPlaceholder dark={dark} bg={bg} monogram={monogram} />;
}

function IconTile({ dark, children }: { dark: boolean; children: React.ReactNode }) {
  return (
    <div
      aria-hidden
      className={[
        "w-9 h-9 rounded-[11px] flex items-center justify-center shrink-0",
        dark ? "text-neutral-100" : "text-neutral-700",
      ].join(" ")}
      style={{
        background: dark ? "var(--tile-dark)" : "var(--face-light)",
        boxShadow: dark ? "var(--tile-dark-shadow)" : "var(--tile-light-shadow)",
      }}
    >
      {children}
    </div>
  );
}

export function Card(props: CardProps) {
  if (props.layout === "stack") {
    const {
      title,
      badge,
      subtitle,
      note,
      image,
      imageSrc,
      imageAlt = "",
      imageBg,
      actions,
      className = "",
      children,
    } = props;

    return (
      <CardShell
        as="article"
        className={className}
        rail={actions}
      >
        {/* Hairline under the media so it reads as set into the face */}
        <div className="relative h-52 shrink-0 overflow-hidden" style={{ boxShadow: "0 1px 0 rgba(17,17,17,0.07)" }}>
          <Media image={image} imageSrc={imageSrc} imageAlt={imageAlt} bg={imageBg} />
        </div>

        <div className="flex-1 flex flex-col p-6">
          {(title || badge) && (
            <div className="flex items-center gap-2">
              {title && (
                <h3 className="text-[17px] font-semibold text-neutral-900 tracking-[-0.015em] leading-snug">{title}</h3>
              )}
              {badge}
            </div>
          )}
          {subtitle && (
            // Line breaks in the copy are for centred layouts; let it flow here
            <p className="mt-1.5 text-[14px] text-neutral-600 leading-[1.55] text-pretty">
              {subtitle.replace(/\n/g, " ")}
            </p>
          )}
          {children}
          {note && (
            <p className="mt-auto pt-5 text-[12px] text-neutral-500 leading-relaxed text-pretty">{note}</p>
          )}
        </div>
      </CardShell>
    );
  }

  const {
    title,
    subtitle,
    icon,
    image,
    imageSrc,
    imageAlt = "",
    actions,
    theme = "light",
    className = "",
    children,
  } = props as SplitCardProps;
  const dark = theme === "dark";

  return (
    <CardShell
      as="article"
      theme={dark ? "dark" : "light"}
      className={className}
      faceClassName="flex-row! min-h-[220px]"
      rail={actions}
    >
      {/* The title is the hero: display-sized and pinned to the top. The
          subtitle answers it from the bottom edge, so the two frame the
          face between them instead of huddling in one corner.           */}
      <div className="relative flex flex-col p-7 flex-1 min-w-0">
        {icon && <IconTile dark={dark}>{icon}</IconTile>}
        {title && (
          <h3
            className={[
              "text-[34px] font-medium leading-[1.02] tracking-[-0.04em] text-balance max-w-[14ch]",
              icon ? "mt-5" : "",
              dark ? "text-white" : "text-neutral-900",
            ].join(" ")}
          >
            {title}
          </h3>
        )}
        <div className="mt-auto pt-8 flex flex-col gap-2">
          {subtitle && (
            <p className="text-[14px] leading-[1.45] tracking-[-0.005em] text-neutral-500">{subtitle}</p>
          )}
          {children}
        </div>
      </div>
      <div
        className="relative w-[40%] shrink-0 overflow-hidden"
        style={{ boxShadow: dark ? "-1px 0 0 rgba(255,255,255,0.07)" : "-1px 0 0 rgba(17,17,17,0.07)" }}
      >
        <Media
          image={image}
          imageSrc={imageSrc}
          imageAlt={imageAlt}
          dark={dark}
          monogram={typeof title === "string" ? title.trim().charAt(0).toLowerCase() : undefined}
        />
      </div>
    </CardShell>
  );
}

interface CardGridProps {
  children: React.ReactNode;
  className?: string;
}

export function CardGrid({ children, className = "" }: CardGridProps) {
  return (
    <div className={["grid grid-cols-1 sm:grid-cols-2 gap-4", className].join(" ")}>
      {children}
    </div>
  );
}
