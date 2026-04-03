import { z } from "zod";

const dateSchema = z.coerce.date();

const imageSchema = z.object({
  publicId: z.string().min(1),
  secureUrl: z.string().url(),
  width: z.number().nullable().optional(),
  height: z.number().nullable().optional(),
  format: z.string().nullable().optional(),
  bytes: z.number().nullable().optional(),
  uploadedAt: z.coerce.date().optional(),
});

export const createTaleSchema = z.object({
  title: z.string().min(1),
  story: z.string().min(1),
  visibility: z.enum(["private", "public", "unlisted"]).optional().default("public"),
  visitedLocation: z.array(z.string().min(1)).optional().default([]),
  isFav: z.boolean().optional().default(false),
  images: z.array(imageSchema).min(1).max(10),
  visitedDate: dateSchema,
});

export const updateTaleSchema = createTaleSchema.partial();