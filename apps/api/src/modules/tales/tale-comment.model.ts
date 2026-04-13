import { Schema, model, type InferSchemaType } from "mongoose";

const taleCommentSchema = new Schema(
  {
    tale: {
      type: Schema.Types.ObjectId,
      ref: "Tale",
      required: true,
      index: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    body: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export type TaleComment = InferSchemaType<typeof taleCommentSchema>;
export const TaleCommentModel = model<TaleComment>("TaleComment", taleCommentSchema);