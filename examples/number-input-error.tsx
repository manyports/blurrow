import { NumberInput } from "@/components/ui/NumberInput";

export default function NumberInputError() {
  return <NumberInput label="age" defaultValue={12} min={0} error="you need to be 13 or older" />;
}
