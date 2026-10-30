import { Checkbox } from "@/components/ui/Checkbox";

export default function CheckboxDisabled() {
  return (
    <div className="flex flex-col gap-3">
      <Checkbox defaultChecked disabled label="required cookies" description="always on" />
      <Checkbox disabled label="archived content" description="not available on this plan" />
    </div>
  );
}
