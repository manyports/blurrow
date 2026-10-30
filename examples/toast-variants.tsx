"use client";

import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

export default function ToastVariants() {
  const { toast } = useToast();
  return (
    <div className="flex flex-wrap justify-center gap-2">
      <Button variant="secondary" size="sm" onClick={() => toast({ title: "post published", description: "it's live and indexed.", variant: "success" })}>
        success
      </Button>
      <Button variant="secondary" size="sm" onClick={() => toast({ title: "storage almost full", description: "you've used 92% of your plan.", variant: "warning" })}>
        warning
      </Button>
      <Button variant="secondary" size="sm" onClick={() => toast({ title: "connection lost", description: "check your network and try again.", variant: "error" })}>
        error
      </Button>
    </div>
  );
}
