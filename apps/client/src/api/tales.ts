import { http } from "./http";
import type { Tale } from "../types/tale";

type TaleDto = {
  _id: string;
  owner: string;
  title: string;
  story: string;
  visitedLocation: string[];
  visitedDate: string;
  isFav: boolean;
  imgUrls: string[];
  createdAt: string;
  updatedAt: string;
};

const mapTale = (dto: TaleDto): Tale => ({
  id: dto._id,
  title: dto.title,
  story: dto.story,
  visitedLocation: dto.visitedLocation ?? [],
  visitedDate: dto.visitedDate,
  isFav: !!dto.isFav,
  imgUrls: dto.imgUrls ?? [],
});

export async function listTales(): Promise<Tale[]> {
  const res = await http.get<{ tales: TaleDto[] }>("/tales");
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
  visitedLocation: string[];
  visitedDate: Date;
  images: File[];
};

async function uploadImages(images: File[]): Promise<string[]> {
  const fd = new FormData();
  images.forEach((f) => fd.append("images", f));

  const res = await http.post<{ imgUrls: string[] }>(`/tales/upload`, fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data.imgUrls ?? [];
}

export async function createTale(input: CreateTaleInput): Promise<Tale> {
  const imgUrls = input.images.length ? await uploadImages(input.images) : [];

  const res = await http.post<{ tale: TaleDto }>(`/tales`, {
    title: input.title,
    story: input.story,
    visitedLocation: input.visitedLocation,
    visitedDate: input.visitedDate.toISOString(),
    isFav: false,
    imgUrls,
  });

  return mapTale(res.data.tale);
}
