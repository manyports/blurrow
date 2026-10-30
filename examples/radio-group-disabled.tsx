import { RadioGroup } from "@/components/ui/Radio";

export default function RadioGroupDisabled() {
  return (
    <RadioGroup
      defaultValue="free"
      options={[
        { value: "free", label: "free" },
        { value: "pro", label: "pro" },
        { value: "team", label: "team", description: "coming soon", disabled: true },
      ]}
    />
  );
}
