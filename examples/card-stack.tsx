import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function CardStack() {
  return (
    <div className="w-full max-w-sm">
      <Card
        layout="stack"
        imageBg="bg-[#8A8E7A]"
        title="blurrow"
        badge={<Badge variant="muted">oss</Badge>}
        subtitle="tactile components for people who care how things feel."
        note="built with tailwind css v4 and archivo."
        actions={
          <>
            <Button variant="secondary" size="sm">learn more</Button>
            <Button variant="primary" size="sm">read docs</Button>
          </>
        }
      />
    </div>
  );
}
