import { ButtonGroup } from "@/components/ui/ButtonGroup";

const icon = (d: string) => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d={d} />
  </svg>
);

export default function ButtonGroupDemo() {
  return (
    <ButtonGroup
      label="text alignment"
      items={[
        { label: "align left", content: icon("M4 6h16M4 12h10M4 18h14") },
        { label: "align center", content: icon("M4 6h16M7 12h10M5 18h14") },
        { label: "align right", content: icon("M4 6h16M10 12h10M6 18h14") },
      ]}
    />
  );
}
