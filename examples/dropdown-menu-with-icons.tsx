import { Button } from "@/components/ui/Button";
import { DropdownMenu } from "@/components/ui/DropdownMenu";

const icon = (d: string) => (
  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d={d} />
  </svg>
);

export default function DropdownMenuWithIcons() {
  return (
    <DropdownMenu
      position="bottom-end"
      trigger={<Button variant="secondary" size="sm">share</Button>}
      items={[
        { key: "link", label: "copy link", icon: icon("M10 14a5 5 0 007 0l3-3a5 5 0 00-7-7l-1 1M14 10a5 5 0 00-7 0l-3 3a5 5 0 007 7l1-1") },
        { key: "email", label: "send by email", icon: icon("M3 8l9 6 9-6M5 5h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z") },
        { key: "embed", label: "embed", icon: icon("M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4") },
      ]}
    />
  );
}
