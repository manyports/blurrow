import { Button } from "@/components/ui/Button";

export default function ButtonSizes() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <Button variant="secondary" size="sm">small</Button>
      <Button variant="secondary" size="md">medium</Button>
      <Button variant="secondary" size="lg">large</Button>
    </div>
  );
}
