"use client";

import { useState } from "react";
import { Steps } from "@/components/ui/Steps";
import { Button } from "@/components/ui/Button";

const steps = [{ label: "draft" }, { label: "review" }, { label: "schedule" }, { label: "publish" }];

export default function StepsInteractive() {
  const [current, setCurrent] = useState(0);
  return (
    <div className="w-full max-w-lg flex flex-col gap-6">
      <Steps current={current} steps={steps} />
      <div className="flex justify-end gap-2">
        <Button variant="secondary" size="sm" disabled={current === 0} onClick={() => setCurrent((c) => c - 1)}>
          back
        </Button>
        <Button variant="primary" size="sm" disabled={current === steps.length} onClick={() => setCurrent((c) => c + 1)}>
          {current >= steps.length - 1 ? "finish" : "next"}
        </Button>
      </div>
    </div>
  );
}
