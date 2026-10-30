import { Button } from "@/components/ui/Button";

export default function ButtonOnDark() {
  return (
    <div
      className="w-full max-w-md rounded-[20px] p-8 flex flex-wrap items-center justify-center gap-2"
      style={{ background: "var(--card-dark)", boxShadow: "var(--card-dark-shadow)" }}
    >
      <Button variant="secondary" tone="dark" size="sm">secondary</Button>
      <Button variant="outline" tone="dark" size="sm">outline</Button>
    </div>
  );
}
