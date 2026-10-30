import type { Metadata } from "next";
import { LinkButton } from "@/components/docs/LinkButton";

export const metadata: Metadata = { title: "Page not found", robots: { index: false, follow: true } };

export default function NotFound() {
  return (
    <main className="mx-auto max-w-[1200px] px-4 sm:px-6 py-32 flex flex-col items-start gap-5">
      <h1 className="text-[clamp(32px,4.4vw,44px)] font-medium tracking-[-0.04em] text-neutral-900">
        hmm, there&apos;s nothing here.
      </h1>
      <p className="text-[16px] text-neutral-500">the page might have moved, or the link has a typo.</p>
      <LinkButton href="/" variant="secondary">
        back home
      </LinkButton>
    </main>
  );
}
