/* When a page's content last really changed: the date of the last
   commit that touched the files it's made from. Google uses a
   sitemap's lastmod only while it stays accurate, and learns to ignore
   one that's simply the build time, so with no git history to read
   (a tarball deploy, say) this returns undefined and the date is left
   out rather than made up.                                         */
import { execFileSync } from "node:child_process";
import type { RegistryEntry } from "./registry";

const cache = new Map<string, Date | undefined>();

export function lastModified(paths: string[]): Date | undefined {
  const key = paths.join("\n");
  if (cache.has(key)) return cache.get(key);
  let date: Date | undefined;
  try {
    const out = execFileSync("git", ["log", "-1", "--format=%cI", "--", ...paths], {
      cwd: process.cwd(),
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
    date = out ? new Date(out) : undefined;
  } catch {
    date = undefined;
  }
  cache.set(key, date);
  return date;
}

/* What each page is built from */
export const pageSources = {
  home: ["app/page.tsx", "components/landing", "lib/site.ts"],
  docs: ["app/docs/page.tsx"],
  installation: ["app/docs/installation/page.tsx", "components/ui/styles.css"],
  components: ["app/docs/components/page.tsx", "lib/registry.ts"],
  privacy: ["app/privacy/page.tsx"],
  component: (e: RegistryEntry) => [`components/ui/${e.file}.tsx`, ...e.examples.map((x) => `examples/${x.name}.tsx`)],
};

