import { Skeleton } from "@/components/ui/Skeleton";

export default function SkeletonDemo() {
  return (
    <div className="w-full max-w-sm flex items-center gap-3">
      <Skeleton variant="circle" />
      <div className="flex-1 flex flex-col gap-2">
        <Skeleton variant="text" width="40%" />
        <Skeleton variant="text" lines={2} />
      </div>
    </div>
  );
}
