import { Button } from "@/components/ui/Button";
import { SpotlightCard } from "@/components/ui/SpotlightCard";

export default function SpotlightCardDemo() {
  return (
    <div className="w-full max-w-xl">
      <SpotlightCard
        theme="dark"
        size="lg"
        eyebrow="new"
        title="realtime collaboration is here."
        subtitle="invite an editor and review drafts together before they go out."
        actions={<Button variant="secondary" tone="dark" size="sm">get early access</Button>}
      />
    </div>
  );
}
