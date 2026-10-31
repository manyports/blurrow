"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Drawer";

export default function DrawerLeft() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="secondary" size="sm" onClick={() => setOpen(true)}>
        open from the left
      </Button>
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        side="left"
        size="sm"
        title="filters"
        description="narrow down the posts you see."
      >
        <p className="py-4 text-[13px] text-ink-muted">put navigation or filters here.</p>
      </Drawer>
    </>
  );
}
