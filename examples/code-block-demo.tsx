import { CodeBlock } from "@/components/ui/CodeBlock";

const code = `import { Button } from "@/components/ui/Button";

export default function App() {
  return <Button variant="primary">Get started</Button>;
}`;

export default function CodeBlockDemo() {
  return (
    <div className="w-full max-w-xl">
      <CodeBlock language="tsx" title="app.tsx" showLineNumbers code={code} />
    </div>
  );
}
