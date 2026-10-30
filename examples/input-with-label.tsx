import { Input } from "@/components/ui/Input";

export default function InputWithLabel() {
  return (
    <div className="w-full max-w-xs">
      <Input label="email" type="email" placeholder="you@example.com" hint="we'll never share your email." fullWidth />
    </div>
  );
}
