import Link from "next/link";

/* Typography for the docs' own copy */

export function PageTitle({ eyebrow, title, description }: { eyebrow?: React.ReactNode; title: string; description: string }) {
  return (
    <div className="flex flex-col gap-3">
      {eyebrow}
      <h1 className="text-[clamp(32px,4.4vw,44px)] font-medium leading-[1.05] tracking-[-0.04em] text-neutral-900">{title}</h1>
      <p className="text-[16px] leading-[1.6] text-neutral-500 max-w-[60ch] text-pretty">{description}</p>
    </div>
  );
}

export function H2({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="scroll-mt-24 text-[22px] font-medium tracking-[-0.03em] text-neutral-900 pb-3 border-b border-neutral-900/[0.07]">
      {children}
    </h2>
  );
}

export function H3({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h3 id={id} className="scroll-mt-24 text-[16px] font-semibold tracking-[-0.015em] text-neutral-900">
      {children}
    </h3>
  );
}

export function P({ children }: { children: React.ReactNode }) {
  return <p className="text-[14.5px] leading-[1.7] text-neutral-600 max-w-[68ch] text-pretty">{children}</p>;
}

export function InlineCode({ children }: { children: React.ReactNode }) {
  return (
    <code
      className="px-1.5 py-0.5 rounded-[6px] text-[12.5px] font-mono text-neutral-800"
      style={{ background: "var(--well)", boxShadow: "var(--well-shadow)" }}
    >
      {children}
    </code>
  );
}

export function TextLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="link-slide font-medium text-neutral-900">
      {children}
    </Link>
  );
}
