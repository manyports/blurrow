"use client";

import { useState } from "react";
import { Select } from "@/components/ui/Select";

const options = [
  { value: "newest", label: "newest first" },
  { value: "oldest", label: "oldest first" },
  { value: "popular", label: "most popular" },
];

export default function SelectWithLabel() {
  const [sort, setSort] = useState("newest");
  return <Select label="sort by" hint="applies to every list" options={options} value={sort} onChange={setSort} />;
}
