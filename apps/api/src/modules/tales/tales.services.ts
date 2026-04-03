import { Types } from "mongoose";
import { TaleModel, type Tale } from "./tales.model.js";

function httpError(message: string, status: number) {
  const e = new Error(message) as Error & { status?: number };
  e.status = status;
  return e;
}

function assertObjectId(id: string) {
  if (!Types.ObjectId.isValid(id)) throw httpError("INVALID_ID", 400);
}

export async function createTale(userId: string, data: {
  title: string;
  story: string;
  visibility?: "private" | "public" | "unlisted";
  visitedLocation: string[];
  isFav: boolean;
  images: {
      publicId: string;
      secureUrl: string;
      width?: number | null | undefined;
      height?: number | null | undefined;
      format?: string | null | undefined;
      bytes?: number | null | undefined;
      uploadedAt?: Date | undefined;
    }[];
  visitedDate: Date;
}) {
  assertObjectId(userId);

  return TaleModel.create({
    owner: userId,
    ...data,
  });
}

export async function listTales() {
  return TaleModel.find({visibility: "public"}).populate("owner","username fullName").sort({ createdAt: -1 });
}

export async function getTaleById(userId: string, taleId: string) {
  assertObjectId(userId);
  assertObjectId(taleId);

  const tale = await TaleModel.findOne({ _id: taleId, owner: userId });
  if (!tale) throw httpError("TALE_NOT_FOUND", 404);

  return tale;
}

export async function getByUser(userId: string){
  assertObjectId(userId);
  const tales = await TaleModel.find({owner: userId});
  if (!tales) throw httpError("TALES_NOT_FOUND", 404);
  return tales;
}

export async function updateTale(userId: string, taleId: string, updates: Partial<Tale>) {
  assertObjectId(userId);
  assertObjectId(taleId);

  // Prevent owner changes from client
  if ("owner" in updates) delete (updates as any).owner;

  const tale = await TaleModel.findOneAndUpdate(
    { _id: taleId, owner: userId },
    updates,
    { new: true, runValidators: true }
  );

  if (!tale) throw httpError("TALE_NOT_FOUND", 404);

  return tale;
}

export async function deleteTale(userId: string, taleId: string) {
  assertObjectId(userId);
  assertObjectId(taleId);

  const deleted = await TaleModel.findOneAndDelete({ _id: taleId, owner: userId });
  if (!deleted) throw httpError("TALE_NOT_FOUND", 404);

  return deleted;
}

export async function toggleFav(userId: string, taleId: string) {
  assertObjectId(userId);
  assertObjectId(taleId);

  const tale = await TaleModel.findOne({ _id: taleId, owner: userId });
  if (!tale) throw httpError("TALE_NOT_FOUND", 404);

  tale.isFav = !tale.isFav;
  await tale.save();

  return tale;
}

export async function removeImageFromTale(userId: string, taleId: string, publicId: string) {
  assertObjectId(userId);
  assertObjectId(taleId);

  const tale = await TaleModel.findOne({ _id: taleId, owner: userId }).select("images");
  if (!tale) throw httpError("TALE_NOT_FOUND", 404);

  const image = tale.images.find((img: any) => img.publicId === publicId);
  if (!image) throw httpError("IMAGE_NOT_FOUND_ON_TALE", 404);

  await TaleModel.updateOne(
    { _id: taleId, owner: userId },
    { $pull: { images: { publicId } } }
  );

  return image;
}