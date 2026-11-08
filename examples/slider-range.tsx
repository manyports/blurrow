"use client";

import { useState } from "react";
import { Slider } from "@/components/ui/Slider";

export default function SliderRange() {
  const [price, setPrice] = useState<[number, number]>([40, 160]);
  return (
    <div className="w-72">
      <Slider
        label="price"
        min={0}
        max={200}
        step={5}
        value={price}
        onChange={setPrice}
        showValue={([lo, hi]) => `$${lo} – $${hi}`}
      />
    </div>
  );
}
