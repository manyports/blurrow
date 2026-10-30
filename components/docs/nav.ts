import { entriesByCategory } from "@/lib/registry";

export interface NavLink {
  title: string;
  href: string;
}

export interface NavSection {
  title: string;
  links: NavLink[];
}

export const docsNav: NavSection[] = [
  {
    title: "getting started",
    links: [
      { title: "introduction", href: "/docs" },
      { title: "installation", href: "/docs/installation" },
      { title: "all components", href: "/docs/components" },
    ],
  },
  ...entriesByCategory().map(({ category, entries }) => ({
    title: category,
    links: entries.map((e) => ({ title: e.name, href: `/docs/components/${e.slug}` })),
  })),
];
