import { Slider } from "@/components/ui/Slider";

export default function SliderMarks() {
  return (
    <div className="flex w-72 flex-col gap-8">
      <Slider label="quality" defaultValue={50} step={25} marks={[0, 25, 50, 75, 100]} />
      <Slider label="locked" defaultValue={30} disabled />
    </div>
  );
}
