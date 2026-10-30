import { TagInput } from "@/components/ui/TagInput";

export default function TagInputMax() {
  return (
    <div className="w-full max-w-sm">
      <TagInput defaultValue={["essay"]} maxTags={3} label="topics" hint="up to 3" placeholder="add a topic…" fullWidth />
    </div>
  );
}
