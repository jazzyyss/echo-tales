import { http } from "./http";
import type { Me } from "../auth/authStore";

export async function uploadProfilePicture(file: File) {
  const formData = new FormData();
  formData.append("image", file);

  const res = await http.post<{
    profilePicture: Me["media"]["profilePicture"];
    user: Me;
  }>("/users/me/profile-picture", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
}

export async function deleteProfilePicture() {
  await http.delete("/users/me/profile-picture");
}