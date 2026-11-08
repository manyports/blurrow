"use client";

import { useState } from "react";
import { NumberInput } from "@/components/ui/NumberInput";

export default function NumberInputUnits() {
  const [price, setPrice] = useState<number | null>(12.5);
  const [weight, setWeight] = useState<number | null>(2.4);
  return (
    <div className="flex flex-col gap-4 sm:flex-row">
      <NumberInput label="price" prefix="$" step={0.5} precision={2} min={0} value={price} onChange={setPrice} />
      <NumberInput label="weight" suffix="kg" step={0.1} min={0} max={50} value={weight} onChange={setWeight} />
    </div>
  );
}
