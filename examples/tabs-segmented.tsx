"use client";

import { useState } from "react";
import { Tabs } from "@/components/ui/Tabs";

export default function TabsSegmented() {
  const [view, setView] = useState("week");
  return (
    <div className="flex flex-col items-center gap-3">
      <Tabs
        defaultTab="week"
        onChange={setView}
        tabs={[
          { key: "day", label: "day" },
          { key: "week", label: "week" },
          { key: "month", label: "month" },
        ]}
      />
      <p className="text-[13px] text-neutral-500">showing the {view} view</p>
    </div>
  );
}
