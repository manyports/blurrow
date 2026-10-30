import { Input } from "@/components/ui/Input";

export default function InputDisabled() {
  return (
    <div className="w-full max-w-xs">
      <Input label="username" defaultValue="manyports" disabled fullWidth />
    </div>
  );
}
