import streamifier from "streamifier";
import { cloudinary } from "./cloudinary.js";

export type UploadedImage = {
  publicId: string;
  secureUrl: string;
  width: number | null;
  height: number | null;
  format: string | null;
  bytes: number | null;
  uploadedAt: Date;
};

export function uploadImageBuffer(
  file: Express.Multer.File,
  folder = "tales"
): Promise<UploadedImage> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        if (!result?.public_id || !result.secure_url) {
          reject(new Error("Cloudinary upload failed"));
          return;
        }

        resolve({
          publicId: result.public_id,
          secureUrl: result.secure_url,
          width: typeof result.width === "number" ? result.width : null,
          height: typeof result.height === "number" ? result.height : null,
          format: typeof result.format === "string" ? result.format : null,
          bytes: typeof result.bytes === "number" ? result.bytes : null,
          uploadedAt: new Date(),
        });
      }
    );

    streamifier.createReadStream(file.buffer).pipe(uploadStream);
  });
}

export async function deleteImageByPublicId(publicId: string): Promise<void> {
  const result = await cloudinary.uploader.destroy(publicId, {
    resource_type: "image",
  });

  if (result.result !== "ok" && result.result !== "not found") {
    throw new Error("Cloudinary delete failed");
  }
}