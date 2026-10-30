import { Tabs } from "@/components/ui/Tabs";

export default function TabsDemo() {
  return (
    <div className="w-full max-w-md">
      <Tabs
        tabs={[
          { key: "overview", label: "overview", content: <p>a minimal writing toolkit built for focus. zero clutter, pure craft.</p> },
          { key: "posts", label: "posts", content: <p>discover posts across design, engineering, and product thinking.</p> },
          { key: "resources", label: "resources", content: <p>curated tools, references and frameworks for modern makers.</p> },
        ]}
      />
    </div>
  );
}
