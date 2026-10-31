import Link from "next/link";

interface PagerLink {
  title: string;
  href: string;
}

function PagerCard({ link, dir }: { link: PagerLink; dir: "prev" | "next" }) {
  return (
    <Link
      href={link.href}
      className={[
        "group rounded-[16px] p-1 flex-1 sm:flex-none sm:min-w-[200px] outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink",
        dir === "next" ? "ml-auto" : "",
      ].join(" ")}
      style={{ background: "var(--panel-bezel)", boxShadow: "var(--panel-shadow)" }}
    >
      <span
        className={["flex flex-col gap-0.5 rounded-[12px] bg-panel-face px-4 py-3", dir === "next" ? "items-end" : "items-start"].join(" ")}
        style={{ boxShadow: "var(--panel-face-shadow)" }}
      >
        <span className="text-[11.5px] text-ink-faint">{dir === "prev" ? "previous" : "next"}</span>
        <span className="flex items-center gap-1.5 text-[14px] font-medium text-ink">
          {dir === "prev" && <span className="transition-transform duration-300 group-hover:-translate-x-0.5">←</span>}
          {link.title}
          {dir === "next" && <span className="transition-transform duration-300 group-hover:translate-x-0.5">→</span>}
        </span>
      </span>
    </Link>
  );
}

export function Pager({ prev, next }: { prev?: PagerLink; next?: PagerLink }) {
  return (
    <div className="flex gap-3 pt-6">
      {prev && <PagerCard link={prev} dir="prev" />}
      {next && <PagerCard link={next} dir="next" />}
    </div>
  );
}
