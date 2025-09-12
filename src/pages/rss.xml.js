import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = await getCollection('posts');
  return rss({
    title: 'Luke — Updates',
    description: 'News and posts from Luke.',
    site: context.site,
    items: posts.map((p) => ({
      title: p.data.title,
      pubDate: p.data.published ? new Date(p.data.published) : new Date(),
      description: p.data.summary,
      link: `/posts/${p.slug}/`,
    })),
  });
}