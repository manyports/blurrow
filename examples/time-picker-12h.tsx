"use client";

import { useState } from "react";
import { TimePicker } from "@/components/ui/TimePicker";

export default function TimePicker12h() {
  const [time, setTime] = useState<string | null>(null);
  return (
    <TimePicker
      label="pickup"
      hint="between 8 am and 6 pm"
      hour12
      step={30}
      min="08:00"
      max="18:00"
      value={time}
      onChange={setTime}
    />
  );
}
