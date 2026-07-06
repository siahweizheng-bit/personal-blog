import rss from '@astrojs/rss';
import { getPosts } from '../lib/notion.js';
import { site } from '../config.js';

export async function GET(context) {
  const posts = await getPosts();
  return rss({
    title: site.name,
    description: site.tagline,
    site: context.site,
    items: posts.map((p) => ({
      title: p.title,
      pubDate: p.date ? new Date(p.date) : new Date(),
      description: p.summary,
      link: `/blog/${p.slug}/`,
    })),
  });
}
