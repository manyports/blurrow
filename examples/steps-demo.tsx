import { Steps } from "@/components/ui/Steps";

export default function StepsDemo() {
  return (
    <div className="w-full max-w-lg">
      <Steps
        current={1}
        steps={[
          { label: "account", description: "create your account" },
          { label: "profile", description: "set up your profile" },
          { label: "done", description: "start writing" },
        ]}
      />
    </div>
  );
}
