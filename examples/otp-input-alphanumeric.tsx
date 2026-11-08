import { OtpInput } from "@/components/ui/OtpInput";

export default function OtpInputAlphanumeric() {
  return (
    <div className="flex flex-col gap-6">
      <OtpInput label="invite code" type="alphanumeric" length={5} />
      <OtpInput label="pin" length={4} mask />
    </div>
  );
}
