import { Input } from "@/components/ui/Input";

export default function InputError() {
  return (
    <div className="w-full max-w-xs">
      <Input label="website" defaultValue="example" error="enter a full url, like https://example.com" fullWidth />
    </div>
  );
}
