"use client";

import { useState } from "react";
import { RadioCards } from "@/components/ui/RadioCards";

const plans = [
  { value: "hobby", label: "hobby", aside: "free", description: "one project, community support." },
  { value: "pro", label: "pro", aside: "$12 / mo", description: "unlimited projects and a custom domain." },
  { value: "team", label: "team", aside: "$40 / mo", description: "everything in pro, plus shared billing and roles." },
];

export default function RadioCardsDemo() {
  const [plan, setPlan] = useState("pro");
  return (
    <div className="w-full max-w-sm">
      <RadioCards label="plan" options={plans} value={plan} onChange={setPlan} />
    </div>
  );
}
