import { Avatar } from "@/components/ui/Avatar";
import { HoverCard } from "@/components/ui/HoverCard";

export default function HoverCardDemo() {
  return (
    <p className="max-w-sm text-[14px] leading-relaxed text-ink-body">
      the first published algorithm for a machine was written by{" "}
      <HoverCard
        trigger={
          <a href="#ada" className="font-medium text-ink underline decoration-ink-ghost underline-offset-4 hover:decoration-ink">
            ada lovelace
          </a>
        }
      >
        <div className="flex gap-3">
          <Avatar name="ada lovelace" />
          <div className="flex flex-col gap-1">
            <span className="text-[13.5px] font-semibold text-ink">ada lovelace</span>
            <span className="text-[12.5px] leading-relaxed text-ink-muted">
              mathematician and writer. wrote the notes on babbage&apos;s analytical engine.
            </span>
            <span className="mt-1 text-[11.5px] text-ink-faint">1815 – 1852</span>
          </div>
        </div>
      </HoverCard>{" "}
      in 1843.
    </p>
  );
}
