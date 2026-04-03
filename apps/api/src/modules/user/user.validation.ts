import { z } from "zod";

export const updateProfilePictureResponseSchema = z.object({
  profilePicture: z.object({
    publicId: z.string().nullable(),
    secureUrl: z.string().nullable(),
    width: z.number().nullable(),
    height: z.number().nullable(),
    format: z.string().nullable(),
    bytes: z.number().nullable(),
    uploadedAt: z.coerce.date().nullable(),
  }),
});

export type UpdateProfilePictureResponse = z.infer<
  typeof updateProfilePictureResponseSchema
>;