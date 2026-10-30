import { Textarea } from "@/components/ui/Textarea";

export default function TextareaDemo() {
  return (
    <div className="w-full max-w-sm">
      <Textarea label="bio" placeholder="tell us about yourself…" fullWidth />
    </div>
  );
}
