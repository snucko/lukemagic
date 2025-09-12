import { getCollection } from 'astro:content';
import { buildIndex } from '../components/SearchIndex';

export async function GET() {
  const tricks = await getCollection('tricks');
  const posts = await getCollection('posts');
  const docs = [
    ...tricks.map(t => ({ id: `tricks/${t.slug}`, title: t.data.title, summary: t.data.summary ?? '', tags: t.data.tags ?? [] })),
    ...posts.map(p => ({ id: `posts/${p.slug}`, title: p.data.title, summary: p.data.summary ?? '', tags: [] }))
  ];
  const json = buildIndex(docs);
  return new Response(JSON.stringify(json), { headers: { 'content-type': 'application/json' } });
}