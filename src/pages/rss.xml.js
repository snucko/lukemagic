import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const ideas = await getCollection('idea');
  return rss({
    title: 'Luke — Daily Magic Ideas',
    description: 'Daily magic trick ideas from Luke.',
    site: context.site,
    items: ideas.map((i) => ({
      title: i.data.title,
      pubDate: new Date(),
      description: i.data.description,
      link: `/ideas/`,
    })),
  });
}