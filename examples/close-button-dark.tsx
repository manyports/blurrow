import { CloseButton } from "@/components/ui/CloseButton";

export default function CloseButtonDark() {
  return (
    <div
      className="rounded-[16px] px-8 py-6 flex items-center gap-3"
      style={{ background: "var(--face-dark)", boxShadow: "var(--face-dark-shadow)" }}
    >
      <CloseButton tone="dark" size="sm" />
      <CloseButton tone="dark" size="md" />
    </div>
  );
}
