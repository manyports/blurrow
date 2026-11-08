"use client";

import { useState } from "react";
import { DatePicker } from "@/components/ui/DatePicker";

const isWeekend = (d: Date) => d.getDay() === 0 || d.getDay() === 6;

export default function DatePickerLimits() {
  const [today] = useState(() => new Date());
  const [date, setDate] = useState<Date | null>(null);
  const inSixWeeks = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 42);
  return (
    <DatePicker
      label="book a call"
      hint="weekdays in the next six weeks"
      value={date}
      onChange={setDate}
      min={today}
      max={inSixWeeks}
      isDateDisabled={isWeekend}
      weekStartsOn={1}
    />
  );
}
