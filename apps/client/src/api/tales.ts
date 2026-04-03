import { http } from "./http";
import type { ImageAsset } from "../types/media";
import type { Tale } from "../types/tale";

type TaleDto = {
  _id: string;
  owner: {
    _id: string;
    fullName: string;
    username: string;
  };
  visibility?: "private" | "public" | "unlisted";
  title: string;
  story: string;
  visitedLocation: string[];
  visitedDate: string;
  isFav: boolean;
  images?: ImageAsset[];
  createdAt: string;
  updatedAt: string;
};

const mapTale = (dto: TaleDto): Tale => ({
  id: dto._id,
  owner: dto.owner,
  visibility: dto.visibility ?? "public",
  title: dto.title,
  story: dto.story,
  visitedLocation: dto.visitedLocation ?? [],
  visitedDate: dto.visitedDate,
  isFav: !!dto.isFav,
  images: dto.images ?? [],
  createdAt: dto.createdAt,
  updatedAt: dto.updatedAt,
});

export async function listTales(): Promise<Tale[]> {
  const res = await http.get<{ tales: TaleDto[] }>("/tales");
  return (res.data.tales ?? []).map(mapTale);
}

export async function taleById(id: string | undefined): Promise<Tale> {
  if (!id) throw new Error("Tale id is required");

  const res = await http.get<{ tale: TaleDto }>(`/tales/${id}`);
  return mapTale(res.data.tale);
}

export async function talesByUser(userId: string | undefined): Promise<Tale[]> {
  if (!userId) throw new Error("User id is required");

  const res = await http.get<{ tales: TaleDto[] }>(`/tales/user/${userId}`);
  return (res.data.tales ?? []).map(mapTale);
}

export async function toggleFav(id: string): Promise<Tale> {
  const res = await http.patch<{ tale: TaleDto }>(`/tales/${id}/toggle-fav`);
  return mapTale(res.data.tale);
}

export async function deleteTale(id: string): Promise<void> {
  await http.delete(`/tales/${id}`);
}

export type CreateTaleInput = {
  title: string;
  story: string;
  visibility?: "private" | "public" | "unlisted";
  visitedLocation: string[];
  visitedDate: string;
  isFav?: boolean;
  images: ImageAsset[];
};

export async function uploadTaleImages(files: File[]): Promise<ImageAsset[]> {
  const formData = new FormData();

  for (const file of files) {
    formData.append("images", file);
  }

  const res = await http.post<{ images: ImageAsset[] }>("/tales/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data.images ?? [];
}

export async function createTale(payload: CreateTaleInput): Promise<Tale> {
  const res = await http.post<{ tale: TaleDto }>("/tales", payload);
  return mapTale(res.data.tale);
}

export async function deleteTaleImage(taleId: string, publicId: string): Promise<void> {
  await http.delete(`/tales/${taleId}/images`, {
    data: { publicId },
  });
}