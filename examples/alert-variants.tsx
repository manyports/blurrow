import { Alert } from "@/components/ui/Alert";

export default function AlertVariants() {
  return (
    <div className="w-full max-w-md flex flex-col gap-2.5">
      <Alert variant="default" title="new version available" description="blurrow v1.1.0 is ready to install." />
      <Alert variant="success" title="published successfully" description="your post is now live and indexed." />
      <Alert variant="warning" title="draft auto-saved" description="your changes were saved 2 minutes ago." />
      <Alert variant="error" title="failed to publish" description="check your connection and try again." />
    </div>
  );
}
