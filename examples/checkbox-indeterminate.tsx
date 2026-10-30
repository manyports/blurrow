"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/Checkbox";

const topics = ["design", "engineering", "writing"];

export default function CheckboxIndeterminate() {
  const [picked, setPicked] = useState<string[]>(["design"]);
  const all = picked.length === topics.length;

  return (
    <div className="flex flex-col gap-3">
      <Checkbox
        label="all topics"
        checked={all}
        indeterminate={picked.length > 0 && !all}
        onChange={() => setPicked(all ? [] : topics)}
      />
      <div className="flex flex-col gap-3 pl-7">
        {topics.map((t) => (
          <Checkbox
            key={t}
            label={t}
            checked={picked.includes(t)}
            onChange={(on) => setPicked((p) => (on ? [...p, t] : p.filter((x) => x !== t)))}
          />
        ))}
      </div>
    </div>
  );
}
