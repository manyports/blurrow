"use client";

import { useState } from "react";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";

export default function AlertDismissible() {
  const [shown, setShown] = useState(true);
  return (
    <div className="w-full max-w-md flex justify-center">
      {shown ? (
        <Alert
          className="w-full"
          variant="error"
          title="failed to publish"
          description="check your connection and try again."
          onDismiss={() => setShown(false)}
        />
      ) : (
        <Button variant="secondary" size="sm" onClick={() => setShown(true)}>show again</Button>
      )}
    </div>
  );
}
