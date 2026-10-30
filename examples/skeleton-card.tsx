import { Skeleton } from "@/components/ui/Skeleton";

export default function SkeletonCard() {
  return (
    <div className="w-full max-w-lg grid grid-cols-2 gap-3">
      <Skeleton variant="card" label="loading post" />
      <Skeleton variant="card" label="loading post" />
    </div>
  );
}
