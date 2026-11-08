"use client";

import { useState } from "react";
import { Combobox } from "@/components/ui/Combobox";

const zones = [
  { value: "America/Los_Angeles", label: "los angeles", description: "pacific time · utc−8", keywords: ["pst", "san francisco"] },
  { value: "America/New_York", label: "new york", description: "eastern time · utc−5", keywords: ["est", "toronto"] },
  { value: "Europe/London", label: "london", description: "greenwich mean time · utc+0", keywords: ["gmt", "uk"] },
  { value: "Europe/Berlin", label: "berlin", description: "central european time · utc+1", keywords: ["cet", "paris"] },
  { value: "Asia/Almaty", label: "almaty", description: "kazakhstan time · utc+5", keywords: ["astana"] },
  { value: "Asia/Tokyo", label: "tokyo", description: "japan standard time · utc+9", keywords: ["jst"] },
  { value: "Australia/Sydney", label: "sydney", description: "australian eastern time · utc+10", keywords: ["aest"], disabled: true },
];

export default function ComboboxDescriptions() {
  const [zone, setZone] = useState<string | null>(null);
  return (
    <Combobox
      label="time zone"
      hint="try typing “gmt” or “paris”"
      placeholder="search cities…"
      options={zones}
      value={zone}
      onChange={setZone}
    />
  );
}
