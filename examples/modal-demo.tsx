"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

export default function ModalDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="secondary" size="sm" onClick={() => setOpen(true)}>
        delete post
      </Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="delete post?"
        description="this can't be undone. the post and all of its comments will be permanently removed."
        actions={
          <>
            <Button variant="secondary" size="sm" onClick={() => setOpen(false)}>cancel</Button>
            <Button variant="primary" size="sm" onClick={() => setOpen(false)}>delete</Button>
          </>
        }
      />
    </>
  );
}
