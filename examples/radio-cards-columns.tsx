"use client";

import { useState } from "react";
import { RadioCards } from "@/components/ui/RadioCards";

const icon = (d: string) => (
  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d={d} />
  </svg>
);

const speeds = [
  { value: "standard", label: "standard", description: "4–6 days", icon: icon("M3 7h11v9H3zM14 10h4l3 3v3h-7") },
  { value: "express", label: "express", description: "1–2 days", icon: icon("M13 3 5 14h6l-1 7 8-11h-6l1-7z") },
  { value: "pickup", label: "pickup", description: "not in your area", icon: icon("M4 10 12 4l8 6v10H4zM10 20v-6h4v6"), disabled: true },
];

export default function RadioCardsColumns() {
  const [speed, setSpeed] = useState("standard");
  return (
    <div className="w-full max-w-xl">
      <RadioCards label="delivery" columns={3} options={speeds} value={speed} onChange={setSpeed} />
    </div>
  );
}
