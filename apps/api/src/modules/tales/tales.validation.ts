import { z } from "zod";

const dateSchema = z.coerce.date();

export const createTaleSchema = z.object({
  title: z.string().min(1),
  story: z.string().min(1),

  visitedLocation: z.array(z.string().min(1)).optional().default([]),

  isFav: z.boolean().optional().default(false),

  imgUrl: z.string().min(1),

  visitedDate: dateSchema,
});

export const updateTaleSchema = createTaleSchema.partial();
