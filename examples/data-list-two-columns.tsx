import { DataList } from "@/components/ui/DataList";

export default function DataListTwoColumns() {
  return (
    <div className="w-full max-w-lg">
      <DataList
        columns={2}
        items={[
          { label: "plan", value: "pro" },
          { label: "seats", value: "4 of 5" },
          { label: "renews", value: "nov 30, 2026" },
          { label: "amount", value: "$12 / month" },
        ]}
      />
    </div>
  );
}
