import { Button } from "@/components/ui/Button";
import { Card, CardGrid } from "@/components/ui/Card";

export default function CardGridDemo() {
  return (
    <CardGrid className="w-full">
      <Card
        theme="dark"
        title="newsletter"
        subtitle="ideas in your inbox"
        actions={<Button variant="secondary" tone="dark" size="sm">subscribe</Button>}
      />
      <Card
        title="rss feed"
        subtitle="follow along anywhere"
        actions={<Button variant="outline" size="sm">follow</Button>}
      />
    </CardGrid>
  );
}
