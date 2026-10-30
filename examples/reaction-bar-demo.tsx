import { ReactionBar } from "@/components/ui/ReactionBar";

export default function ReactionBarDemo() {
  return (
    <ReactionBar
      reactions={[
        { emoji: "👏", label: "clap", count: 24 },
        { emoji: "❤️", label: "love", count: 12, active: true },
        { emoji: "🔥", label: "fire", count: 5 },
        { emoji: "💡", label: "insightful", count: 9 },
      ]}
    />
  );
}
