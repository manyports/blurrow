import { Button } from "@/components/ui/Button";
import { Popover } from "@/components/ui/Popover";

const positions = ["top", "bottom", "left", "right"] as const;

export default function PopoverPositions() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 py-10">
      {positions.map((p) => (
        <Popover key={p} position={p} trigger={<Button variant="secondary" size="sm">{p}</Button>}>
          <p className="text-[13px] text-ink-body whitespace-nowrap">opens to the {p}.</p>
        </Popover>
      ))}
    </div>
  );
}
