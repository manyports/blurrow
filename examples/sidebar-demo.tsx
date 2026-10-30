"use client";

import { useState } from "react";
import { Sidebar } from "@/components/ui/Sidebar";

const icon = (d: string) => (
  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d={d} />
  </svg>
);

export default function SidebarDemo() {
  const [active, setActive] = useState("posts");
  return (
    <Sidebar
      className="w-[240px]"
      active={active}
      onSelect={setActive}
      header={{
        logo: icon("M4 19.5A2.5 2.5 0 016.5 17H20V3H6.5A2.5 2.5 0 004 5.5v14zM20 17v4H6.5A2.5 2.5 0 014 18.5"),
        title: "blurrow",
        subtitle: "personal workspace",
      }}
      sections={[
        {
          title: "content",
          items: [
            { key: "posts", label: "posts", badge: 12, icon: icon("M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l6 6v8a2 2 0 01-2 2z") },
            { key: "drafts", label: "drafts", badge: 3, icon: icon("M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.4-9.4a2 2 0 112.8 2.8L11.8 15H9v-2.8l8.6-8.6z") },
            { key: "scheduled", label: "scheduled", icon: icon("M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z") },
          ],
        },
        {
          title: "settings",
          items: [
            { key: "profile", label: "profile", icon: icon("M16 8a4 4 0 11-8 0 4 4 0 018 0zM4 20c0-4 3.6-7 8-7s8 3 8 7") },
            { key: "billing", label: "billing", icon: icon("M2 10h20M4 5h16a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V7a2 2 0 012-2z") },
            { key: "api", label: "api", disabled: true, icon: icon("M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4") },
          ],
        },
      ]}
    />
  );
}
