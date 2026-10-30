import { Banner } from "@/components/ui/Banner";

export default function BannerVariants() {
  return (
    <div className="w-full max-w-xl flex flex-col gap-4">
      <Banner variant="default">default banner for announcements.</Banner>
      <Banner variant="accent">accent banner for launches and promotions.</Banner>
      <Banner variant="warning">warning banner for scheduled maintenance.</Banner>
    </div>
  );
}
