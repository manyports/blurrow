import { Breadcrumb } from "@/components/ui/Breadcrumb";

export default function BreadcrumbDemo() {
  return (
    <Breadcrumb
      items={[
        { label: "home", href: "#" },
        { label: "blog", href: "#" },
        { label: "design systems", href: "#" },
        { label: "components" },
      ]}
    />
  );
}
