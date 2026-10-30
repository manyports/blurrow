import { StatCard } from "@/components/ui/StatCard";

export default function StatCardDark() {
  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
      <StatCard
        theme="dark"
        label="subscribers"
        value={3142}
        delta={{ value: "8.2%", direction: "up" }}
        sparkline={[2400, 2500, 2650, 2700, 2820, 2950, 3000, 3080, 3142]}
        hint="all-time high"
      />
      <StatCard
        theme="dark"
        label="bounce rate"
        value={38.4}
        suffix="%"
        decimals={1}
        delta={{ value: "2.1%", direction: "down" }}
        hint="vs. last 30 days"
      />
    </div>
  );
}
