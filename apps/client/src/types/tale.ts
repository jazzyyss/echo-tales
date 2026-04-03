import type { ImageAsset } from "./media";

export type Tale = {
  id: string;
  owner: {
    _id: string;
    fullName: string;
    username: string;
  };
  visibility: "private" | "public" | "unlisted";
  title: string;
  story: string;
  visitedLocation: string[];
  visitedDate: string;
  isFav: boolean;
  images: ImageAsset[];
  createdAt: string;
  updatedAt: string;
};