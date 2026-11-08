"use client";

import { useState } from "react";
import { Slider } from "@/components/ui/Slider";

export default function SliderDemo() {
  const [volume, setVolume] = useState(60);
  return (
    <div className="w-72">
      <Slider label="volume" value={volume} onChange={setVolume} showValue={(v) => `${v}%`} />
    </div>
  );
}
