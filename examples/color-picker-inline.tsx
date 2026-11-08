"use client";

import { useState } from "react";
import { ColorPicker } from "@/components/ui/ColorPicker";

export default function ColorPickerInline() {
  const [color, setColor] = useState("#16a34a");
  return <ColorPicker inline value={color} onChange={setColor} />;
}
