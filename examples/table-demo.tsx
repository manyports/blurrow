"use client";

import { Badge } from "@/components/ui/Badge";
import { Table } from "@/components/ui/Table";

export default function TableDemo() {
  return (
    <div className="w-full">
      <Table
        title="recent posts"
        description="4 articles across all categories"
        columns={[
          { key: "title", label: "title" },
          {
            key: "status",
            label: "status",
            render: (v) => (
              <Badge variant={v === "published" ? "default" : v === "draft" ? "muted" : "accent"}>{String(v)}</Badge>
            ),
          },
          { key: "reads", label: "reads", align: "right" },
          { key: "date", label: "date", align: "right" },
        ]}
        rows={[
          { title: "the quiet art of long-form writing", status: "published", reads: 1842, date: "apr 1" },
          { title: "designing with constraints", status: "published", reads: 920, date: "mar 18" },
          { title: "on building in public", status: "draft", reads: 0, date: "apr 8" },
          { title: "the tools i actually use", status: "review", reads: 0, date: "apr 9" },
        ]}
      />
    </div>
  );
}
