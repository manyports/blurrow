"use client";

import { useState } from "react";
import { OtpInput } from "@/components/ui/OtpInput";

export default function OtpInputDemo() {
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<"idle" | "wrong">("idle");
  return (
    <OtpInput
      label="verification code"
      hint={status === "idle" ? "we sent it to ada@example.com. (123456 works)" : undefined}
      error={status === "wrong" ? "that code didn't match" : undefined}
      groupSize={3}
      value={code}
      onChange={(c) => {
        setCode(c);
        setStatus("idle");
      }}
      onComplete={(c) => setStatus(c === "123456" ? "idle" : "wrong")}
    />
  );
}
