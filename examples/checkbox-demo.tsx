"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/Checkbox";

export default function CheckboxDemo() {
  const [checked, setChecked] = useState(true);
  return <Checkbox label="accept terms and conditions" checked={checked} onChange={setChecked} />;
}
