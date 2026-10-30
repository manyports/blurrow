import { Avatar } from "@/components/ui/Avatar";

export default function AvatarSizes() {
  return (
    <div className="flex items-center gap-3">
      <Avatar name="ada lovelace" size="sm" />
      <Avatar name="ada lovelace" size="md" />
      <Avatar name="ada lovelace" size="lg" />
    </div>
  );
}
