import { Schema, model, type InferSchemaType } from "mongoose";

const imageSchema = new Schema(
  {
    publicId: { type: String, required: true },
    secureUrl: { type: String, required: true },
    width: { type: Number, default: null },
    height: { type: Number, default: null },
    format: { type: String, default: null },
    bytes: { type: Number, default: null },
    uploadedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const taleSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    visibility: {
      type: String,
      enum: ["private", "public", "unlisted"],
      default: "public",
      index: true,
    },
    title: {
      type: String,
      default: "",
    },
    story: {
      type: String,
      default: "",
    },
    visitedLocation: {
      type: [String],
      default: [],
    },
    isFav: {
      type: Boolean,
      default: false,
    },
    images: {
      type: [imageSchema],
      validate: {
        validator: (arr: unknown[]) => arr.length >= 1 && arr.length <= 10,
        message: "A tale must have between 1 and 10 images",
      },
      required: true,
    },
    visitedDate: {
      type: Date,
      default: Date.now,
    },

    likedBy: {
      type: [Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
    likeCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export type Tale = InferSchemaType<typeof taleSchema>;
export const TaleModel = model<Tale>("Tale", taleSchema);