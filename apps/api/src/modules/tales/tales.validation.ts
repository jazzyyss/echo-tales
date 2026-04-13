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

const baseCreateSchema = z.object({
  title: z.string().trim().optional(),
  story: z.string().trim().optional(),
  caption: z.string().trim().optional(),
  visibility: z.enum(["private", "public", "unlisted"]).optional().default("public"),
  visitedLocation: z.array(z.string().trim().min(1)).optional().default([]),
  isFav: z.boolean().optional().default(false),
  images: z.array(imageSchema).min(1).max(10),
  visitedDate: dateSchema.optional(),
});

export const createTaleSchema = baseCreateSchema.transform((data, ctx) => {
  const story = (data.story ?? data.caption ?? "").trim();
  const title = (data.title ?? "").trim();
  const visitedLocation = data.visitedLocation ?? [];

  if (!story) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["story"],
      message: "Story or caption is required",
    });
    return z.NEVER;
  }

  const derivedTitle =
    title || story.slice(0, 60).trim() || visitedLocation[0] || "Untitled tale";

  return {
    title: derivedTitle,
    story,
    visibility: data.visibility ?? "public",
    visitedLocation,
    isFav: data.isFav ?? false,
    images: data.images,
    visitedDate: data.visitedDate ?? new Date(),
  };
});

export const updateTaleSchema = z
  .object({
    title: z.string().trim().min(1).optional(),
    story: z.string().trim().min(1).optional(),
    caption: z.string().trim().min(1).optional(),
    visibility: z.enum(["private", "public", "unlisted"]).optional(),
    visitedLocation: z.array(z.string().trim().min(1)).optional(),
    isFav: z.boolean().optional(),
    images: z.array(imageSchema).min(1).max(10).optional(),
    visitedDate: dateSchema.optional(),
  })
  .transform((data) => {
    const next = { ...data } as Record<string, unknown>;
    if (typeof data.caption === "string" && !data.story) {
      next.story = data.caption;
    }
    delete next.caption;
    return next;
  });

export const createCommentSchema = z.object({
  body: z.string().trim().min(1).max(500),
});