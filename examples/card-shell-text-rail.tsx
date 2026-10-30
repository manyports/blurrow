import { CardShell } from "@/components/ui/CardShell";

export default function CardShellTextRail() {
  return (
    <div className="w-full max-w-sm">
      <CardShell railKind="text" rail={<span>updated 2 hours ago</span>}>
        <div className="p-6">
          <h3 className="text-[17px] font-semibold text-neutral-900 tracking-[-0.015em]">weekly report</h3>
          <p className="mt-1.5 text-[14px] text-neutral-600 leading-[1.55]">
            plain context on the rail lines up with the text on the face.
          </p>
        </div>
      </CardShell>
    </div>
  );
}
