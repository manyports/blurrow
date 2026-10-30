import { Button } from "@/components/ui/Button";

export default function ButtonVariants() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <Button variant="primary">primary</Button>
      <Button variant="secondary">secondary</Button>
      <Button variant="outline">outline</Button>
      <Button variant="ghost">ghost</Button>
    </div>
  );
}
