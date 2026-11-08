"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";

export default function SpinnerInButton() {
  const [saving, setSaving] = useState(false);
  const save = () => {
    setSaving(true);
    setTimeout(() => setSaving(false), 1600);
  };
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="primary" onClick={save} disabled={saving} aria-busy={saving}>
        {saving && <Spinner size="sm" />}
        {saving ? "saving…" : "save changes"}
      </Button>
      <Button variant="secondary" disabled>
        <Spinner size="sm" />
        loading
      </Button>
    </div>
  );
}
