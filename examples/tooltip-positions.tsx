import { Button } from "@/components/ui/Button";
import { Tooltip } from "@/components/ui/Tooltip";

const positions = ["top", "bottom", "left", "right"] as const;

export default function TooltipPositions() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {positions.map((p) => (
        <Tooltip key={p} content={`tooltip on ${p}`} position={p}>
          <Button variant="secondary" size="sm">{p}</Button>
        </Tooltip>
      ))}
    </div>
  );
}
