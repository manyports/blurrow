import { Button } from "@/components/ui/Button";
import { CardShell } from "@/components/ui/CardShell";

export default function CardShellDemo() {
  return (
    <div className="w-full max-w-sm">
      <CardShell
        rail={
          <>
            <Button variant="secondary" size="sm">preview</Button>
            <Button variant="primary" size="sm">publish</Button>
          </>
        }
      >
        <div className="p-6">
          <h3 className="text-[17px] font-semibold text-ink tracking-[-0.015em]">ready to publish</h3>
          <p className="mt-1.5 text-[14px] text-ink-body leading-[1.55]">
            content lives on the face. controls live on the rail below it.
          </p>
        </div>
      </CardShell>
    </div>
  );
}
