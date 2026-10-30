import { Badge } from "@/components/ui/Badge";

export default function BadgeVariants() {
  return (
    <div className="flex flex-wrap gap-2">
      <Badge variant="default">default</Badge>
      <Badge variant="muted">muted</Badge>
      <Badge variant="accent">accent</Badge>
    </div>
  );
}
