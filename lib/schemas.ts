import { z } from 'zod';

// Zod schema for movie data
export const MovieSchema = z.object({
  Title: z.string(),
  Year: z.string(),
  Poster: z.string().url(),
});

export const MoviesResponseSchema = z.object({
  Search: z.array(MovieSchema),
  Response: z.string(),
  Error: z.string().optional(),
});
