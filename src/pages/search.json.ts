import { getCollection } from 'astro:content';

export async function GET() {
  const ideas = await getCollection('idea');
  const shows = await getCollection('shows');

  const docs = [
    ...ideas.map(i => ({
      slug: i.slug,
      type: 'idea' as const,
      title: i.data.title,
      description: i.data.description,
    })),
    ...shows.map(s => ({
      slug: s.slug,
      type: 'show' as const,
      title: s.data.title,
      description: s.data.summary,
    })),
  ];

  return new Response(JSON.stringify(docs), { headers: { 'content-type': 'application/json' } });
}
