import { Avatar, AvatarGroup } from "@/components/ui/Avatar";

const people = ["ada lovelace", "alan turing", "grace hopper", "edsger dijkstra", "barbara liskov", "donald knuth", "margaret hamilton"];

export default function AvatarGroupDemo() {
  return (
    <AvatarGroup max={5}>
      {people.map((name) => (
        <Avatar key={name} name={name} />
      ))}
    </AvatarGroup>
  );
}
