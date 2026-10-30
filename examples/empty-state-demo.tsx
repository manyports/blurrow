import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";

export default function EmptyStateDemo() {
  return (
    <div className="w-full max-w-md">
      <EmptyState
        icon={
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l6 6v8a2 2 0 01-2 2z" />
          </svg>
        }
        title="no posts yet"
        description="get started by creating your first post. it only takes a minute."
        action={<Button variant="primary" size="sm">create post</Button>}
      />
    </div>
  );
}
