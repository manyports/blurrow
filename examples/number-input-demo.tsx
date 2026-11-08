"use client";

import { useState } from "react";
import { NumberInput } from "@/components/ui/NumberInput";

export default function NumberInputDemo() {
  const [seats, setSeats] = useState<number | null>(3);
  return <NumberInput label="seats" hint="between 1 and 20" value={seats} onChange={setSeats} min={1} max={20} />;
}
