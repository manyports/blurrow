import { Progress } from "@/components/ui/Progress";

export default function ProgressStacked() {
  return (
    <div className="w-full max-w-sm flex flex-col gap-3">
      <Progress label="articles written" value={76} showValue />
      <Progress label="subscriber goal" value={52} showValue />
      <Progress label="storage used" value={88} showValue />
      <Progress label="draft completion" value={30} showValue />
    </div>
  );
}
