import { Accordion } from "@/components/ui/Accordion";

export default function AccordionMultiple() {
  return (
    <div className="w-full max-w-md">
      <Accordion
        allowMultiple
        items={[
          { key: "a", title: "shipping", content: "orders ship within two business days.", defaultOpen: true },
          { key: "b", title: "returns", content: "return anything within 30 days, no questions asked." },
          { key: "c", title: "warranty", content: "every product carries a two-year warranty." },
        ]}
      />
    </div>
  );
}
