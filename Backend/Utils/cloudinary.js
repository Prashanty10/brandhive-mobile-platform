import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadToCloudinary = async (file, folder = "brandhive") => {
  if (!file) throw new Error("No file provided");

  if (typeof file === "string" && file.startsWith("data:image")) {
    const result = await cloudinary.uploader.upload(file, {
      folder,
      resource_type: "image",
    });
    return result;
  }

  if (Buffer.isBuffer(file)) {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder, resource_type: "image" },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );

      stream.end(file);
    });
  }

  return { secure_url: file };
};

export default uploadToCloudinary;
