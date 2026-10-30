"use client";

import { useState } from "react";
import { Toggle } from "@/components/ui/Toggle";

export default function ToggleWithDescription() {
  const [email, setEmail] = useState(true);
  const [push, setPush] = useState(false);
  return (
    <div className="flex flex-col gap-4">
      <Toggle checked={email} onChange={setEmail} label="email notifications" description="receive the weekly digest" />
      <Toggle checked={push} onChange={setPush} label="push notifications" description="comments and mentions" />
    </div>
  );
}
