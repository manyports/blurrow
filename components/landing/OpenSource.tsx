import { formatStars } from "@/lib/github";
import { npmUrl, repo } from "@/lib/site";

function StarIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2.8l2.83 5.74 6.33.92-4.58 4.46 1.08 6.3L12 17.25l-5.66 2.97 1.08-6.3L2.84 9.46l6.33-.92L12 2.8z" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 .5a11.5 11.5 0 00-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 015.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.42-2.69 5.39-5.26 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0012 .5z" />
    </svg>
  );
}

function NpmIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path fillRule="evenodd" d="M3 3h18v18H3V3zm4 4v10h5V9.5h2.5V17H17V7H7z" />
    </svg>
  );
}

function LinkRow({
  href,
  icon,
  label,
  detail,
}: {
  href: string;
  icon: React.ReactNode;
  label: React.ReactNode;
  detail?: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener"
      className="group rounded-[12px] px-4 py-3.5 flex items-center gap-3 transition-transform duration-200 hover:-translate-y-px active:translate-y-px outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"
      style={{ background: "var(--face-light)", boxShadow: "var(--thumb-shadow)" }}
    >
      <span className="text-neutral-700">{icon}</span>
      <span className="flex-1 text-[14.5px] font-medium text-neutral-900">{label}</span>
      {detail && <span className="text-[13px] text-neutral-500 tabular-nums">{detail}</span>}
      <span aria-hidden className="text-neutral-300 transition-[transform,color] duration-300 group-hover:translate-x-0.5 group-hover:text-neutral-900">
        →
      </span>
    </a>
  );
}

/* The project's front door: it's open, here's how to help. Links rest in
   a well as raised rows, the same as the drafts tray above.           */
export function OpenSource({ stars }: { stars: number | null }) {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] gap-6 lg:gap-14 py-14 border-t border-neutral-900/[0.08]">
      <div className="flex flex-col gap-4">
        <h2 className="text-[clamp(26px,2.8vw,34px)] font-medium leading-[1.1] tracking-[-0.035em] text-neutral-900">
          open source, and open to you
        </h2>
        <p className="text-[15.5px] leading-[1.65] text-neutral-600 max-w-[46ch] text-pretty">
          blurrow is free and mit licensed. found a bug, want a component that isn&apos;t here, or have an idea for one
          that is? issues and pull requests are very welcome.
        </p>
        <p className="text-[15.5px] leading-[1.65] text-neutral-600 max-w-[46ch] text-pretty">
          and if you like it, a star on github helps other people find it.
        </p>
      </div>
      <div
        className="rounded-[20px] p-2.5 flex flex-col gap-2 self-start"
        style={{ background: "var(--well)", boxShadow: "var(--well-shadow)" }}
      >
        <LinkRow
          href={repo.url}
          icon={<StarIcon />}
          label="star blurrow on github"
          detail={stars ? `${formatStars(stars)} ${stars === 1 ? "star" : "stars"}` : "be the first to star it"}
        />
        <LinkRow href={`${repo.url}/issues/new`} icon={<GitHubIcon />} label="open an issue or share an idea" />
        <LinkRow href={`${repo.url}/pulls`} icon={<GitHubIcon />} label="send a pull request" />
        <LinkRow href={npmUrl} icon={<NpmIcon />} label="@blurrow/ui on npm" />
      </div>
    </section>
  );
}
