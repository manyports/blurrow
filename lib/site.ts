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

export const siteUrl = "https://www.blurrow.org";
export const siteName = "blurrow";

/* Written for people reading a search result or a link preview. Kept
   under ~160 characters so it isn't cut off mid-thought.           */
export const siteDescription =
  "Buttons that sink when you press them, fields set into the page, and one light behind every shadow. 48 free, open-source React components for Tailwind CSS.";
export const homeTitle = "blurrow | Tactile React components for Tailwind CSS";
/* Link previews: no brand in the title, the headline does the work */
export const socialTitle = "Buttons you want to press, fields you want to fill in";
export const socialDescription =
  "blurrow is a free kit of 48 React components with real depth: buttons in a bezel, fields cut into the surface, and shadows that all agree on one light.";
