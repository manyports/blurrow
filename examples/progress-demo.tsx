import { Progress } from "@/components/ui/Progress";

export default function ProgressDemo() {
  return (
    <div className="w-full max-w-sm">
      <Progress label="uploading cover image" value={64} showValue />
    </div>
  );
}
