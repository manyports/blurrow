"use client";

import { useState } from "react";
import { DatePicker } from "@/components/ui/DatePicker";

export default function DatePickerDemo() {
  const [date, setDate] = useState<Date | null>(null);
  return <DatePicker label="publish on" value={date} onChange={setDate} clearable />;
}
