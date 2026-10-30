/* The npm package the docs tell people to install. Change it here if
   it's published under another name.                                */
export const pkg = "@blurrow/ui";

export const author = { handle: "@manyports", site: "https://manyports.com", siteLabel: "manyports.com" };

/* Page container widths, gutters included. The header's bar spans the
   same column as the page under it, so these must match the
   max-w-[…] classes on the landing page (1200) and docs layout (1360). */
export const container = { site: 1200, docs: 1360, gutter: 24 };

export const repo = { owner: "manyports", name: "blurrow", url: "https://github.com/manyports/blurrow" };
export const npmUrl = "https://www.npmjs.com/package/@blurrow/ui?activeTab=readme";
export const initCommand = `npx ${pkg} init`;
