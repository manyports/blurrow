"use client";

import { useState } from "react";
import { Select } from "@/components/ui/Select";

const options = [
  { value: "design", label: "design" },
  { value: "engineering", label: "engineering" },
  { value: "product", label: "product" },
  { value: "writing", label: "writing" },
];

export default function SelectDemo() {
  const [value, setValue] = useState("");
  return <Select options={options} value={value} onChange={setValue} placeholder="pick a category" />;
}
