"use client";

import { useState } from "react";
import { RadioGroup } from "@/components/ui/Radio";

export default function RadioGroupDemo() {
  const [value, setValue] = useState("monthly");
  return (
    <RadioGroup
      value={value}
      onChange={setValue}
      options={[
        { value: "weekly", label: "weekly", description: "every monday at 9am" },
        { value: "monthly", label: "monthly", description: "first day of the month" },
        { value: "never", label: "never", description: "i'll check manually" },
      ]}
    />
  );
}
