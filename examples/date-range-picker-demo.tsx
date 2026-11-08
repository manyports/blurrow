"use client";

import { useState } from "react";
import { DateRangePicker, type DateRange } from "@/components/ui/DateRangePicker";

const daysAgo = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
};

const presets = [
  { label: "today", range: () => ({ from: new Date(), to: new Date() }) },
  { label: "last 7 days", range: () => ({ from: daysAgo(6), to: new Date() }) },
  { label: "last 30 days", range: () => ({ from: daysAgo(29), to: new Date() }) },
  {
    label: "this month",
    range: () => {
      const now = new Date();
      return { from: new Date(now.getFullYear(), now.getMonth(), 1), to: now };
    },
  },
];

export default function DateRangePickerDemo() {
  const [range, setRange] = useState<DateRange>({ from: null, to: null });
  return <DateRangePicker label="report period" value={range} onChange={setRange} presets={presets} clearable />;
}
