import { Spinner } from "@/components/ui/Spinner";

export default function SpinnerDemo() {
  return (
    <div className="flex items-center gap-6 text-ink-body">
      <Spinner size="sm" />
      <Spinner size="md" label="loading" />
      <Spinner size="lg" />
      <span className="flex items-center gap-2 text-[13px] text-ink-muted">
        <Spinner size="sm" /> syncing…
      </span>
    </div>
  );
}
