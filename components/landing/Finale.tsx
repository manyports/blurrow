import Link from "next/link";
import { author } from "@/lib/site";
import { CopyCommand } from "./CopyCommand";
import { arrow, underline } from "./sketch";

const hand = { fontFamily: "var(--font-hand), cursive" } as const;

/* =) stood upright: two eyes and a wide smile, each put down in one firm
   stroke with a fat pencil, and big enough to hold its own beside the
   note. The smile's ends turn up a little, like it means it.      */
function Smiley() {
  const line = { fill: "none", stroke: "currentColor", strokeWidth: 5, strokeLinecap: "round", strokeLinejoin: "round" } as const;
  return (
    <svg viewBox="0 0 100 92" role="img" aria-label="=)" className="h-[88px] w-[96px] shrink-0 rotate-[-8deg] text-ink sm:h-[112px] sm:w-[122px]">
      <path d="M36,12 C35.5,20 35.8,28 36.6,35" style={line} />
      <path d="M64,10 C63.6,18 63.9,26 64.8,33" style={line} />
      <path d="M12,52 C17,49 18,53 20,57 C30,78 70,80 82,54 C84,50 86,47 91,49" style={line} />
    </svg>
  );
}

const pencil = { fill: "none", stroke: "var(--ink-label)", strokeWidth: 1.3, strokeLinecap: "round", strokeLinejoin: "round" } as const;

/* The last thing on the page, written the way the rest of it was drawn:
   the one command with a note scribbled at it, and a signed sign-off. */
export function Finale({ command }: { command: string }) {
  return (
    <div className="flex flex-col">
      <h2 className="text-[clamp(40px,6vw,80px)] font-medium leading-[1] tracking-[-0.055em] text-ink">
        ready when you are.
      </h2>
      <div className="mt-6 grid grid-cols-1 items-start gap-16 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-20">
      <div className="flex flex-col items-start">
        <p className="max-w-[46ch] text-[17px] leading-[1.6] text-ink-body text-pretty">
          one command installs the package, adds the styles and the font, and sets up toasts. it shows you every change
          before it writes it, and running it twice won&apos;t hurt.
        </p>

        {/* the command, with a note scribbled at it */}
        <div className="relative mt-20 w-full max-w-[440px] sm:mt-24">
          <div aria-hidden className="pointer-events-none absolute -top-[74px] right-0 h-[74px] w-[260px] sm:-right-10">
            <span className="absolute right-0 top-0 rotate-[-3deg] text-[22px] font-semibold leading-none text-ink-body" style={hand}>
              the only one you need
            </span>
            <svg viewBox="0 0 260 74" className="absolute inset-0 h-full w-full overflow-visible">
              <path d={arrow(150, 30, 92, 70, 26, 7, 8)} style={pencil} />
            </svg>
          </div>
          <CopyCommand command={command} />
        </div>
        <Link href="/docs/installation" className="link-slide mt-5 text-[14.5px] font-medium text-ink">
          or read the installation guide →
        </Link>
      </div>

      {/* the sign-off */}
      <figure className="m-0 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-6 gap-y-5 lg:pt-4">
        <blockquote className="col-start-1 m-0 max-w-[24ch] text-[clamp(24px,2.4vw,30px)] font-medium leading-[1.2] text-ink-label" style={hand}>
          thanks for reading all the way down here. if you make something with it, i&apos;d really like to see it.
        </blockquote>
        <figcaption className="relative col-start-1 self-start justify-self-start text-[24px] font-semibold text-ink" style={hand}>
          <a href={author.site} target="_blank" rel="noopener" className="hover:text-ink-body">
            — {author.handle.replace("@", "")}
          </a>
          <svg viewBox="0 0 140 10" className="absolute -bottom-2 left-3 h-[10px] w-[130px] overflow-visible" aria-hidden>
            <path d={underline(0, 5, 140, 19)} style={pencil} />
          </svg>
        </figcaption>
        <div className="col-start-2 row-span-2 row-start-1 self-center">
          <Smiley />
        </div>
      </figure>
      </div>
    </div>
  );
}
