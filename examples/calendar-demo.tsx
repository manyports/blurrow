"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/DatePicker";

export default function CalendarDemo() {
  const [date, setDate] = useState<Date | null>(null);
  return (
    <div className="rounded-[16px] p-1.5" style={{ background: "var(--panel-bezel)", boxShadow: "var(--panel-shadow)" }}>
      <div className="rounded-[11px] bg-panel-face p-2.5" style={{ boxShadow: "var(--panel-face-shadow)" }}>
        <Calendar value={date} onChange={setDate} />
      </div>
    </div>
  );
}
