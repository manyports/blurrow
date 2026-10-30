import { Button } from "@/components/ui/Button";
import { SpotlightCard } from "@/components/ui/SpotlightCard";

export default function SpotlightCardLight() {
  return (
    <div className="w-full max-w-md">
      <SpotlightCard
        theme="light"
        title="version history"
        subtitle="every save is a snapshot. roll back to any of them."
        actions={<Button variant="primary" size="sm">try it</Button>}
      />
    </div>
  );
}
