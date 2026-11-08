"use client";

import { useState } from "react";
import { ColorPicker } from "@/components/ui/ColorPicker";

export default function ColorPickerDemo() {
  const [color, setColor] = useState("#2563eb");
  return <ColorPicker label="accent colour" value={color} onChange={setColor} />;
}
