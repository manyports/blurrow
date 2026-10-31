import { Button } from "@/components/ui/Button";
import { Popover } from "@/components/ui/Popover";

export default function PopoverDemo() {
  return (
    <Popover trigger={<Button variant="secondary" size="sm">quick actions</Button>}>
      <div className="flex flex-col gap-2 w-56">
        <p className="text-[13px] font-semibold text-ink">quick actions</p>
        <p className="text-[12px] text-ink-muted leading-relaxed">edit, duplicate, or archive this post from here.</p>
        <div className="flex gap-2 mt-1">
          <Button variant="secondary" size="sm">archive</Button>
          <Button variant="primary" size="sm">edit</Button>
        </div>
      </div>
    </Popover>
  );
}
