import { ButtonGroup } from "@/components/ui/ButtonGroup";

export default function ButtonGroupWide() {
  return (
    <ButtonGroup
      label="date range"
      items={[
        { label: "last 7 days", content: <span className="px-1 text-[13px] font-medium">7d</span>, wide: true },
        { label: "last 30 days", content: <span className="px-1 text-[13px] font-medium">30d</span>, wide: true },
        { label: "last 90 days", content: <span className="px-1 text-[13px] font-medium">90d</span>, wide: true },
      ]}
    />
  );
}
