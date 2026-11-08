"use client";

import { useState } from "react";
import { Combobox } from "@/components/ui/Combobox";

const languages = [
  "c", "c++", "c#", "clojure", "elixir", "erlang", "go", "haskell", "java", "javascript",
  "kotlin", "lua", "ocaml", "php", "python", "ruby", "rust", "scala", "swift", "typescript", "zig",
].map((l) => ({ value: l, label: l }));

export default function ComboboxDemo() {
  const [lang, setLang] = useState<string | null>("rust");
  return <Combobox label="favourite language" options={languages} value={lang} onChange={setLang} clearable />;
}
