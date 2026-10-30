"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/Checkbox";

export default function CheckboxWithDescription() {
  const [digest, setDigest] = useState(true);
  const [updates, setUpdates] = useState(false);
  return (
    <div className="flex flex-col gap-3">
      <Checkbox checked={digest} onChange={setDigest} label="weekly digest" description="a roundup every monday morning" />
      <Checkbox checked={updates} onChange={setUpdates} label="product updates" description="new features and release notes" />
    </div>
  );
}
