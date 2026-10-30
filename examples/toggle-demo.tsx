"use client";

import { useState } from "react";
import { Toggle } from "@/components/ui/Toggle";

export default function ToggleDemo() {
  const [on, setOn] = useState(true);
  return <Toggle label="auto-save drafts" checked={on} onChange={setOn} />;
}
