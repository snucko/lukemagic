import { getCollection } from 'astro:content';
import { buildIndex } from '../components/SearchIndex';

export async function GET() {
  const ideas = await getCollection('idea');
  const docs = ideas.map(i => ({ 
    id: `idea/${i.slug}`, 
    title: i.data.title, 
    summary: i.data.description ?? '', 
    tags: [i.data.category] 
  }));
  const json = buildIndex(docs);
  return new Response(JSON.stringify(json), { headers: { 'content-type': 'application/json' } });
}