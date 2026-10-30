import { Banner } from "@/components/ui/Banner";
import { Button } from "@/components/ui/Button";

export default function BannerWithAction() {
  return (
    <div className="w-full max-w-xl">
      <Banner
        variant="accent"
        dismissible
        action={<Button variant="secondary" size="sm">upgrade</Button>}
      >
        pro is 20% off this week.
      </Banner>
    </div>
  );
}
