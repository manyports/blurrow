import { QuoteCard } from "@/components/ui/QuoteCard";

export default function QuoteCardDark() {
  return (
    <div className="w-full max-w-sm">
      <QuoteCard
        theme="dark"
        quote="we replaced half our design system with this in a weekend."
        author="grace hopper"
        role="rear admiral, compilers"
      />
    </div>
  );
}
