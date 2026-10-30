"use client";

import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

export default function ToastDemo() {
  const { toast } = useToast();
  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={() => toast({ title: "draft saved", description: "your changes are safe." })}
    >
      show toast
    </Button>
  );
}
