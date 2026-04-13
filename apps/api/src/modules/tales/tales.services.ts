import { Types } from "mongoose";
import { TaleModel, type Tale } from "./tales.model.js";
import { TaleCommentModel } from "./tale-comment.model.js";

function httpError(message: string, status: number) {
  const e = new Error(message) as Error & { status?: number };
  e.status = status;
  return e;
}

function assertObjectId(id: string) {
  if (!Types.ObjectId.isValid(id)) throw httpError("INVALID_ID", 400);
}

type TaleImage = {
  publicId: string;
  secureUrl: string;
  width?: number | null | undefined;
  height?: number | null | undefined;
  format?: string | null | undefined;
  bytes?: number | null | undefined;
  uploadedAt?: Date | undefined;
};

type CreateTaleInput = {
  title: string;
  story: string;
  visibility?: "private" | "public" | "unlisted";
  visitedLocation: string[];
  isFav: boolean;
  images: TaleImage[];
  visitedDate: Date;
};

async function mapTaleWithMeta(tale: any, viewerId?: string) {
  const commentCount = await TaleCommentModel.countDocuments({ tale: tale._id });
  const likedBy = Array.isArray(tale.likedBy) ? tale.likedBy : [];

  return {
    ...tale.toObject(),
    isLikedByMe: viewerId ? likedBy.some((id: any) => String(id) === viewerId) : false,
    commentCount,
  };
}

export async function createTale(userId: string, data: CreateTaleInput) {
  assertObjectId(userId);

  const tale = await TaleModel.create({
    owner: userId,
    ...data,
  });

  return TaleModel.findById(tale._id).populate("owner", "username fullName");
}

export async function listTales(viewerId?: string) {
  const tales = await TaleModel.find({ visibility: "public" })
    .populate("owner", "username fullName")
    .sort({ createdAt: -1 });

  return Promise.all(tales.map((t) => mapTaleWithMeta(t, viewerId)));
}

export async function listMyTales(userId: string) {
  assertObjectId(userId);

  const tales = await TaleModel.find({ owner: userId })
    .populate("owner", "username fullName")
    .sort({ createdAt: -1 });

  return Promise.all(tales.map((t) => mapTaleWithMeta(t, userId)));
}

export async function getTaleById(userId: string, taleId: string) {
  assertObjectId(userId);
  assertObjectId(taleId);

  const tale = await TaleModel.findById(taleId).populate("owner", "username fullName");
  if (!tale) throw httpError("TALE_NOT_FOUND", 404);

  const ownerId = String((tale.owner as any)?._id ?? tale.owner);
  const isOwner = ownerId === userId;

  if (!isOwner && tale.visibility !== "public") {
    throw httpError("TALE_NOT_FOUND", 404);
  }

  return mapTaleWithMeta(tale, userId);
}

export async function updateTale(userId: string, taleId: string, updates: Partial<Tale>) {
  assertObjectId(userId);
  assertObjectId(taleId);

  if ("owner" in updates) delete (updates as any).owner;
  if ("likedBy" in updates) delete (updates as any).likedBy;
  if ("likeCount" in updates) delete (updates as any).likeCount;

  const tale = await TaleModel.findOneAndUpdate(
    { _id: taleId, owner: userId },
    updates,
    { new: true, runValidators: true }
  ).populate("owner", "username fullName");

  if (!tale) throw httpError("TALE_NOT_FOUND", 404);

  return mapTaleWithMeta(tale, userId);
}

export async function deleteTale(userId: string, taleId: string) {
  assertObjectId(userId);
  assertObjectId(taleId);

  await TaleCommentModel.deleteMany({ tale: taleId });

  const deleted = await TaleModel.findOneAndDelete({ _id: taleId, owner: userId });
  if (!deleted) throw httpError("TALE_NOT_FOUND", 404);

  return deleted;
}

export async function toggleFav(userId: string, taleId: string) {
  assertObjectId(userId);
  assertObjectId(taleId);

  const tale = await TaleModel.findOne({ _id: taleId, owner: userId }).populate(
    "owner",
    "username fullName"
  );
  if (!tale) throw httpError("TALE_NOT_FOUND", 404);

  tale.isFav = !tale.isFav;
  await tale.save();

  return mapTaleWithMeta(tale, userId);
}

export async function toggleLike(userId: string, taleId: string) {
  assertObjectId(userId);
  assertObjectId(taleId);

  const tale = await TaleModel.findById(taleId).populate("owner", "username fullName");
  if (!tale) throw httpError("TALE_NOT_FOUND", 404);

  const userObjectId = new Types.ObjectId(userId);
  const alreadyLiked = (tale.likedBy ?? []).some((id: any) => String(id) === userId);

  if (alreadyLiked) {
    tale.likedBy = (tale.likedBy ?? []).filter((id: any) => String(id) !== userId) as any;
    tale.likeCount = Math.max(0, (tale.likeCount ?? 0) - 1);
  } else {
    tale.likedBy = [...(tale.likedBy ?? []), userObjectId] as any;
    tale.likeCount = (tale.likeCount ?? 0) + 1;
  }

  await tale.save();
  return mapTaleWithMeta(tale, userId);
}

export async function listComments(userId: string, taleId: string) {
  assertObjectId(userId);
  assertObjectId(taleId);

  const tale = await TaleModel.findById(taleId).select("owner visibility");
  if (!tale) throw httpError("TALE_NOT_FOUND", 404);

  const isOwner = String(tale.owner) === userId;
  if (!isOwner && tale.visibility !== "public") {
    throw httpError("TALE_NOT_FOUND", 404);
  }

  return TaleCommentModel.find({ tale: taleId })
    .populate("owner", "username fullName")
    .sort({ createdAt: -1 });
}

export async function addComment(userId: string, taleId: string, body: string) {
  assertObjectId(userId);
  assertObjectId(taleId);

  const tale = await TaleModel.findById(taleId).select("owner visibility");
  if (!tale) throw httpError("TALE_NOT_FOUND", 404);

  const isOwner = String(tale.owner) === userId;
  if (!isOwner && tale.visibility !== "public") {
    throw httpError("TALE_NOT_FOUND", 404);
  }

  const comment = await TaleCommentModel.create({
    tale: taleId,
    owner: userId,
    body,
  });

  return TaleCommentModel.findById(comment._id).populate("owner", "username fullName");
}

export async function deleteComment(userId: string, taleId: string, commentId: string) {
  assertObjectId(userId);
  assertObjectId(taleId);
  assertObjectId(commentId);

  const comment = await TaleCommentModel.findOne({
    _id: commentId,
    tale: taleId,
    owner: userId,
  });

  if (!comment) throw httpError("COMMENT_NOT_FOUND", 404);

  await TaleCommentModel.deleteOne({ _id: commentId });
}

export async function removeImageFromTale(userId: string, taleId: string, publicId: string) {
  assertObjectId(userId);
  assertObjectId(taleId);

  const tale = await TaleModel.findOne({ _id: taleId, owner: userId }).select("images");
  if (!tale) throw httpError("TALE_NOT_FOUND", 404);

  const image = tale.images.find((img: any) => img.publicId === publicId);
  if (!image) throw httpError("IMAGE_NOT_FOUND_ON_TALE", 404);

  if (tale.images.length <= 1) {
    throw httpError("A_TALE_MUST_HAVE_AT_LEAST_ONE_IMAGE", 400);
  }

  await TaleModel.updateOne(
    { _id: taleId, owner: userId },
    { $pull: { images: { publicId } } }
  );

  return image;
}