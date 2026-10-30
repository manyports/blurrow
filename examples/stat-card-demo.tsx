import { StatCard } from "@/components/ui/StatCard";

export default function StatCardDemo() {
  return (
    <div className="w-full max-w-xs">
      <StatCard
        label="monthly readers"
        value={24891}
        delta={{ value: "12.4%", direction: "up" }}
        sparkline={[22, 28, 26, 35, 40, 38, 52, 48, 60, 58, 72]}
        hint="vs. last 30 days"
      />
    </div>
  );
}
