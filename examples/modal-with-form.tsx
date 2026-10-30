"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";

export default function ModalWithForm() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="primary" size="sm" onClick={() => setOpen(true)}>
        invite people
      </Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="invite to workspace"
        description="they'll get an email with a link to join."
        actions={
          <>
            <Button variant="secondary" size="sm" onClick={() => setOpen(false)}>cancel</Button>
            <Button variant="primary" size="sm" onClick={() => setOpen(false)}>send invite</Button>
          </>
        }
      >
        <div className="flex flex-col gap-3 pt-2">
          <Input label="email" type="email" placeholder="name@example.com" fullWidth />
        </div>
      </Modal>
    </>
  );
}
