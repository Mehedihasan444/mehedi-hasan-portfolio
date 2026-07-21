import { cloudinary } from "../../config/cloudinary";
import { logger } from "../../config/logger";
import { Readable } from "stream";

export type UploadResult = {
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
  format: string;
};

export async function uploadToCloudinary(
  buffer: Buffer,
  folder: string,
  publicId?: string,
): Promise<UploadResult> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: publicId,
        resource_type: "image",
        transformation: [{ quality: "auto", fetch_format: "auto" }],
      },
      (error, result) => {
        if (error || !result) {
          logger.error({ error }, "Cloudinary upload failed");
          reject(error ?? new Error("Upload failed"));
        } else {
          resolve({
            secure_url: result.secure_url,
            public_id: result.public_id,
            width: result.width,
            height: result.height,
            format: result.format,
          });
        }
      },
    );

    const readable = Readable.from(buffer);
    readable.pipe(uploadStream);
  });
}

export async function deleteFromCloudinary(publicId: string): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    logger.error({ error, publicId }, "Cloudinary delete failed");
    throw error;
  }
}

export function extractPublicId(secureUrl: string): string | null {
  const regex = /\/v\d+\/(.+)\.\w+$/;
  const match = secureUrl.match(regex);
  return match ? match[1] : null;
}
