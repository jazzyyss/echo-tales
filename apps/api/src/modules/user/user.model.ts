import { Schema, model, type InferSchemaType } from "mongoose";

const userImageSchema = new Schema(
  {
    publicId: {
      type: String,
      default: null,
    },
    secureUrl: {
      type: String,
      default: null,
    },
    width: {
      type: Number,
      default: null,
    },
    height: {
      type: Number,
      default: null,
    },
    format: {
      type: String,
      default: null,
    },
    bytes: {
      type: Number,
      default: null,
    },
    uploadedAt: {
      type: Date,
      default: null,
    },
  },
  { _id: false }
);

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
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
      default: null,
      select: false,
    },

    media: {
      type: new Schema(
        {
          profilePicture: {
            type: userImageSchema,
            default: () => ({
              publicId: null,
              secureUrl: null,
              width: null,
              height: null,
              format: null,
              bytes: null,
              uploadedAt: null,
            }),
          },
        },
        { _id: false }
      ),
      default: () => ({
        profilePicture: {
          publicId: null,
          secureUrl: null,
          width: null,
          height: null,
          format: null,
          bytes: null,
          uploadedAt: null,
        },
      }),
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export type User = InferSchemaType<typeof userSchema>;
export const UserModel = model<User>("User", userSchema);