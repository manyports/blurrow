import { Kbd } from "@/components/ui/Kbd";

export default function KbdDemo() {
  return (
    <div className="flex flex-col items-center gap-3 text-[13px] text-ink-muted">
      <div className="flex gap-1">
        <Kbd>⌘</Kbd>
        <Kbd>⇧</Kbd>
        <Kbd>k</Kbd>
      </div>
      <p>
        press <Kbd>⌘k</Kbd> to search
      </p>
    </div>
  );
}
