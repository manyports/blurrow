"use client";

import { useState } from "react";
import { TimePicker } from "@/components/ui/TimePicker";

export default function TimePickerDemo() {
  const [time, setTime] = useState<string | null>("09:30");
  return <TimePicker label="reminder" value={time} onChange={setTime} step={5} clearable />;
}
