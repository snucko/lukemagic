import { defineCollection, z } from 'astro:content';

const tricks = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    tags: z.array(z.string()).optional(),
    summary: z.string().optional(),
    video: z.string().url().optional(),
    durationMin: z.number().optional(),
    published: z.coerce.date().optional()
  })
});

const posts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    summary: z.string().optional(),
    tags: z.array(z.string()).optional(),
    published: z.coerce.date().optional()
  })
});

const shows = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    summary: z.string().optional(),
    tags: z.array(z.string()).optional(),
    date: z.string(),
    time: z.string().optional(),
    city: z.string().optional(),
    venue: z.string().optional(),
    rsvpUrl: z.string().optional()
  })
});

export const collections = { tricks, posts, shows };