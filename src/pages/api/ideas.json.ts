import { getCollection } from 'astro:content';

export async function GET() {
  const ideas = await getCollection('idea');
  return new Response(JSON.stringify(ideas));
}
