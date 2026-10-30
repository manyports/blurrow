import { Timeline } from "@/components/ui/Timeline";

export default function TimelineDemo() {
  return (
    <div className="w-full max-w-md">
      <Timeline
        items={[
          { key: "1", title: "deployed to production", description: "version 1.0.4 is now live.", date: "today", variant: "success" },
          { key: "2", title: "build triggered", description: "started by manyports", date: "yesterday" },
          { key: "3", title: "merged pull request #42", description: "added new components", date: "2 days ago", variant: "accent" },
          { key: "4", title: "flaky test detected", description: "carousel.spec.ts", date: "3 days ago", variant: "warning" },
        ]}
      />
    </div>
  );
}
