import { Types } from "mongoose";
import { TaleModel } from "./tales.model.js";
import type { Tale } from "./tales.model.js";

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
  visitedLocation: string[];
  isFav: boolean;
  imgUrls: string[];
  visitedDate: Date;
}) {
  assertObjectId(userId);

  return TaleModel.create({
    owner: userId,
    ...data,
  });
}

export async function listTales(userId: string) {
  assertObjectId(userId);

  return TaleModel.find({ owner: userId }).sort({ createdAt: -1 });
}

export async function getTaleById(userId: string, taleId: string) {
  assertObjectId(userId);
  assertObjectId(taleId);

  const tale = await TaleModel.findOne({ _id: taleId, owner: userId });
  if (!tale) throw httpError("TALE_NOT_FOUND", 404);

  return tale;
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


export async function removeImageFromTale(userId: string, taleId: string, imgUrl: string) {
  assertObjectId(userId);
  assertObjectId(taleId);

  const tale = await TaleModel.findOne({ _id: taleId, owner: userId }).select("imgUrls");
  if (!tale) throw httpError("TALE_NOT_FOUND", 404);

  const exists = tale.imgUrls.includes(imgUrl);
  if (!exists) throw httpError("IMAGE_NOT_FOUND_ON_TALE", 404);

  await TaleModel.updateOne(
    { _id: taleId, owner: userId },
    { $pull: { imgUrls: imgUrl } }
  );

  return { imgUrl };
}