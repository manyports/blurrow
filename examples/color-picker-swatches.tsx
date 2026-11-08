"use client";

import { useState } from "react";
import { ColorPicker } from "@/components/ui/ColorPicker";

const brand = ["#0f172a", "#334155", "#f43f5e", "#f59e0b", "#10b981"];

export default function ColorPickerSwatches() {
  const [color, setColor] = useState("#f43f5e");
  return <ColorPicker label="label colour" hint="pick from the brand or go your own way" swatches={brand} value={color} onChange={setColor} />;
}
