import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Separator } from "@/components/ui/Separator";

export default function SeparatorDemo() {
  return (
    <div className="flex w-72 flex-col gap-4">
      <Button variant="secondary" fullWidth>
        continue with github
      </Button>
      <Separator label="or" />
      <Input placeholder="you@example.com" fullWidth />
    </div>
  );
}
