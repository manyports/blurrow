import { Button } from "@/components/ui/Button";
import { CardShell } from "@/components/ui/CardShell";

export default function CardShellDark() {
  return (
    <div className="w-full max-w-sm">
      <CardShell theme="dark" rail={<Button variant="secondary" tone="dark" size="sm">learn more</Button>}>
        <div className="p-6">
          <h3 className="text-[17px] font-semibold text-white tracking-[-0.015em]">same lift, darker material</h3>
          <p className="mt-1.5 text-[14px] text-neutral-400 leading-[1.55]">
            the dark chassis casts the same shadow as the light one.
          </p>
        </div>
      </CardShell>
    </div>
  );
}
