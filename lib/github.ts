import { repo } from "./site";

/* Stars on the repo, fetched on the server and refreshed hourly so
   visitors never hit github's rate limit. null if github can't be
   reached; callers just leave the number out.                     */
export async function getStars(): Promise<number | null> {
  try {
    const res = await fetch(`https://api.github.com/repos/${repo.owner}/${repo.name}`, {
      headers: { Accept: "application/vnd.github+json" },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { stargazers_count?: number };
    return typeof data.stargazers_count === "number" ? data.stargazers_count : null;
  } catch {
    return null;
  }
}

export { formatStars } from "./format";
