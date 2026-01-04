import { defineCollection, z } from 'astro:content';

const shows = defineCollection({
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    tags: z.array(z.string()).optional(),
    date: z.date(),
    time: z.string().optional(),
    city: z.string().optional(),
    venue: z.string().optional(),
    rsvpUrl: z.string().optional(),
    image: z.string().optional(),
  }),
});

const idea = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.string(),
  }),
});

export const collections = { shows, idea };