import { Banner } from "@/components/ui/Banner";

export default function BannerDemo() {
  return (
    <div className="w-full max-w-xl">
      <Banner dismissible>blurrow v1.0 is out. read the release notes.</Banner>
    </div>
  );
}
