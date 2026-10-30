import { Badge } from "@/components/ui/Badge";
import { DataList } from "@/components/ui/DataList";

export default function DataListDemo() {
  return (
    <div className="w-full max-w-sm">
      <DataList
        items={[
          { label: "status", value: <Badge>published</Badge> },
          { label: "author", value: "ada lovelace" },
          { label: "published", value: "april 12, 2026" },
          { label: "reading time", value: "8 min" },
        ]}
      />
    </div>
  );
}
