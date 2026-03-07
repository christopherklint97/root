import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getCollection } from "astro:content";

export async function GET(context: APIContext) {
  const thoughts = (await getCollection("thoughts"))
    .filter((t) => !t.data.draft)
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

  return rss({
    title: "Christopher Klint",
    description: "Short takes on engineering, tech, and things I find interesting.",
    site: context.site!,
    items: thoughts.map((thought) => ({
      title: thought.data.title,
      pubDate: thought.data.date,
      description: thought.data.description,
      link: `/thoughts/${thought.id}/`,
    })),
  });
}
