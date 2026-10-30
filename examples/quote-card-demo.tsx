import { QuoteCard } from "@/components/ui/QuoteCard";

export default function QuoteCardDemo() {
  return (
    <div className="w-full max-w-sm">
      <QuoteCard
        quote="the cleanest toolkit i've touched in years. it stays out of the way while i write."
        author="ada lovelace"
        role="analyst, engine co."
      />
    </div>
  );
}
