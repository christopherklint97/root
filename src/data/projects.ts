export const GITHUB_USERNAME = "christopherklint97";

export interface PinnedProject {
  repo: string;
  description?: string;
}

// Pin specific repos to feature them at the top. Add custom descriptions to override GitHub's.
export const pinnedRepos: PinnedProject[] = [
  {
    repo: "clockr",
    description:
      "AI-powered time-tracking CLI that matches work descriptions to Clockify projects using OpenRouter.",
  },
  {
    repo: "streamvault",
    description:
      "IPTV streaming app for Samsung Tizen TVs, built with React, TypeScript, and Zustand.",
  },
  {
    repo: "distill",
    description:
      "Turn YouTube videos and podcast episodes into readable articles using LLM-powered summarization.",
  },
  {
    repo: "whitenoise-caster",
    description:
      "Cast looped white noise to Chromecast and Google Home speakers via a mobile-first web UI.",
  },
];

// Repos to hide from the projects page
export const hiddenRepos: string[] = ["christopherklint97"];

export interface GitHubRepo {
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  fork: boolean;
  topics: string[];
}

export async function fetchGitHubRepos(): Promise<GitHubRepo[]> {
  try {
    const res = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`
    );
    if (!res.ok) return [];
    const repos: GitHubRepo[] = await res.json();

    const pinnedNames = new Set(pinnedRepos.map((p) => p.repo));

    return repos
      .filter((r) => !r.fork && !hiddenRepos.includes(r.name))
      .sort((a, b) => {
        const aPinned = pinnedNames.has(a.name) ? 1 : 0;
        const bPinned = pinnedNames.has(b.name) ? 1 : 0;
        if (aPinned !== bPinned) return bPinned - aPinned;
        return b.stargazers_count - a.stargazers_count;
      });
  } catch {
    return [];
  }
}

export function getDescription(repo: GitHubRepo): string {
  const override = pinnedRepos.find((p) => p.repo === repo.name)?.description;
  return override || repo.description || "No description";
}

export const languageColors: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Go: "#00add8",
  Python: "#3572A5",
  Rust: "#dea584",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Shell: "#89e051",
  Astro: "#ff5a03",
};

export function formatRepoName(name: string): string {
  return name.replace(/[-_]/g, " ");
}
