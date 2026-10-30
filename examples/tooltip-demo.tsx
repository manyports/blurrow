import { Button } from "@/components/ui/Button";
import { Tooltip } from "@/components/ui/Tooltip";

export default function TooltipDemo() {
  return (
    <Tooltip content="add to library">
      <Button variant="secondary" size="sm">hover me</Button>
    </Tooltip>
  );
}
