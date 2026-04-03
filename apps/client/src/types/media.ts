export type ImageAsset = {
  publicId: string;
  secureUrl: string;
  width?: number | null;
  height?: number | null;
  format?: string | null;
  bytes?: number | null;
  uploadedAt?: string | Date | null;
};

export type ProfilePicture = {
  publicId: string | null;
  secureUrl: string | null;
  width?: number | null;
  height?: number | null;
  format?: string | null;
  bytes?: number | null;
  uploadedAt?: string | Date | null;
};