import { DocsNav } from "@/components/docs/DocsNav";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-[1360px] px-4 sm:px-6 lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10">
      <aside className="hidden lg:block sticky top-[84px] h-[calc(100vh-84px)] overflow-y-auto scroll-thin -mx-1 px-1 pt-6 pb-16">
        <DocsNav />
      </aside>
      <div className="min-w-0 pt-8 pb-24">{children}</div>
    </div>
  );
}
