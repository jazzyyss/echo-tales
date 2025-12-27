import { Schema, model, type InferSchemaType } from "mongoose";

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    tokenVersion: {
      type: Number,
      default: 0,
    },
    refreshTokenHash: {
      type: String,
      select: false,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export type User = InferSchemaType<typeof userSchema>;

export const UserModel = model<User>("User", userSchema);
