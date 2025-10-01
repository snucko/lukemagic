import { defineCollection, z } from 'astro:content';

const posts = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    image: z.string().optional(),
    tags: z.array(z.string()).optional(),
    published: z.date(),
  }),
});

const shows = defineCollection({
  schema: z.object({
    title: z.string(),
    location: z.string(),
    date: z.date(),
    luma: z.string().optional(),
    map: z.string().optional(),
  }),
});

const tricks = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    image: z.string().optional(),
    tags: z.array(z.string()).optional(),
  }),
});

const idea = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.string(),
  }),
});

export const collections = { posts, shows, idea };