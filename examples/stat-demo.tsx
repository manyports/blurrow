import { Stat, StatRow } from "@/components/ui/Stat";

export default function StatDemo() {
  return (
    <div className="w-full">
      <StatRow>
        <Stat value={2847} label="total reads" trend="↑ 12%" />
        <Stat value={194} label="subscribers" trend="↑ 4%" />
        <Stat value={38} label="articles" />
        <Stat value={4.9} label="avg. rating" suffix="★" />
      </StatRow>
    </div>
  );
}
