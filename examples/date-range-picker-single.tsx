"use client";

import { useState } from "react";
import { DateRangePicker, type DateRange } from "@/components/ui/DateRangePicker";

export default function DateRangePickerSingle() {
  const [today] = useState(() => new Date());
  const [stay, setStay] = useState<DateRange>({ from: null, to: null });
  return (
    <DateRangePicker
      label="your stay"
      hint="check-in from today"
      singleMonth
      weekStartsOn={1}
      min={today}
      value={stay}
      onChange={setStay}
    />
  );
}
