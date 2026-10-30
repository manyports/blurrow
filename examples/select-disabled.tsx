import { Select } from "@/components/ui/Select";

export default function SelectDisabled() {
  return (
    <Select
      label="workspace"
      options={[{ value: "personal", label: "personal" }]}
      value="personal"
      disabled
    />
  );
}
