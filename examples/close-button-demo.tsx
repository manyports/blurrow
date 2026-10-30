import { CloseButton } from "@/components/ui/CloseButton";

export default function CloseButtonDemo() {
  return (
    <div className="flex items-center gap-3">
      <CloseButton size="sm" />
      <CloseButton size="md" />
    </div>
  );
}
