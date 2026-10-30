import { Accordion } from "@/components/ui/Accordion";

export default function AccordionDemo() {
  return (
    <div className="w-full max-w-md">
      <Accordion
        items={[
          { key: "1", title: "what is blurrow?", content: "a set of tactile ui components that share one material and one light source." },
          { key: "2", title: "is it open source?", content: "yes. copy the files into your project and make them yours." },
          { key: "3", title: "does it need a package?", content: "no. each component is a single file plus the design tokens in globals.css." },
        ]}
      />
    </div>
  );
}
