"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Drawer";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";

export default function DrawerDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="secondary" size="sm" onClick={() => setOpen(true)}>
        edit profile
      </Button>
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        title="edit profile"
        description="make changes to your profile. save when you're done."
        actions={<Button variant="primary" size="sm" onClick={() => setOpen(false)}>save changes</Button>}
      >
        <div className="flex flex-col gap-4 py-4">
          <Input label="name" placeholder="ada lovelace" fullWidth />
          <Input label="username" placeholder="ada" fullWidth />
          <Textarea label="bio" placeholder="tell us about yourself…" fullWidth />
        </div>
      </Drawer>
    </>
  );
}
