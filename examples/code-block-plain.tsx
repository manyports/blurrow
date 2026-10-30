import { CodeBlock } from "@/components/ui/CodeBlock";

export default function CodeBlockPlain() {
  return (
    <div className="w-full max-w-xl">
      <CodeBlock language="bash" code="npm install next react react-dom" />
    </div>
  );
}
