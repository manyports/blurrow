import { Textarea } from "@/components/ui/Textarea";

export default function TextareaAutoResize() {
  return (
    <div className="w-full max-w-sm">
      <Textarea label="notes" placeholder="it grows as you type." hint="markdown supported" autoResize fullWidth />
    </div>
  );
}
