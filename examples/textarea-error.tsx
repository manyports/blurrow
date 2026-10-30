import { Textarea } from "@/components/ui/Textarea";

export default function TextareaError() {
  return (
    <div className="w-full max-w-sm">
      <Textarea label="excerpt" defaultValue="too short" error="excerpts need at least 40 characters." fullWidth />
    </div>
  );
}
