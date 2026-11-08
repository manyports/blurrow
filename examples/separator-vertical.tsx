import { Separator } from "@/components/ui/Separator";

export default function SeparatorVertical() {
  return (
    <div className="flex h-5 items-center gap-4 text-[13px] text-ink-body">
      <span>docs</span>
      <Separator orientation="vertical" />
      <span>components</span>
      <Separator orientation="vertical" />
      <span>github</span>
    </div>
  );
}
