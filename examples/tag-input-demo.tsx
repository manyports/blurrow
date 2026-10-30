"use client";

import { useState } from "react";
import { TagInput } from "@/components/ui/TagInput";

export default function TagInputDemo() {
  const [tags, setTags] = useState(["design", "react"]);
  return (
    <div className="w-full max-w-sm">
      <TagInput value={tags} onChange={setTags} label="tags" hint="press enter or comma to add" fullWidth />
    </div>
  );
}
