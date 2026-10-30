import { Alert } from "@/components/ui/Alert";

export default function AlertDemo() {
  return (
    <div className="w-full max-w-md">
      <Alert title="new version available" description="blurrow v1.1.0 is ready to install." />
    </div>
  );
}
