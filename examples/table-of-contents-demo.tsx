import { TableOfContents } from "@/components/ui/TableOfContents";

export default function TableOfContentsDemo() {
  return (
    <TableOfContents
      className="w-56"
      defaultActiveKey="problem"
      items={[
        { key: "intro", label: "introduction", level: 1 },
        { key: "background", label: "background", level: 2 },
        { key: "problem", label: "the problem", level: 2 },
        { key: "why", label: "why it matters", level: 3 },
        { key: "solution", label: "solution", level: 1 },
      ]}
    />
  );
}
