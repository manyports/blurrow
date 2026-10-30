"use client";

import { Button } from "@/components/ui/Button";
import { DropdownMenu } from "@/components/ui/DropdownMenu";
import { useToast } from "@/components/ui/Toast";

export default function DropdownMenuDemo() {
  const { toast } = useToast();
  return (
    <DropdownMenu
      trigger={<Button variant="secondary" size="sm">options</Button>}
      items={[
        { key: "edit", label: "edit post", shortcut: "⌘e" },
        { key: "duplicate", label: "duplicate", shortcut: "⌘d" },
        { key: "archive", label: "archive", disabled: true },
        { key: "divider", label: "", divider: true },
        { key: "delete", label: "delete post", danger: true, shortcut: "⌘⌫" },
      ]}
      onSelect={(key) => toast({ title: `picked “${key}”` })}
    />
  );
}
