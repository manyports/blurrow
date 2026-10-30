"use client";

import { AuthorCard } from "@/components/ui/AuthorCard";
import { useToast } from "@/components/ui/Toast";

export default function AuthorCardDemo() {
  const { toast } = useToast();
  return (
    <div className="w-full max-w-sm">
      <AuthorCard
        name="ada lovelace"
        bio="writing about machines, poetry, and the space between them."
        onFollow={() => toast({ title: "following ada lovelace", variant: "success" })}
      />
    </div>
  );
}
