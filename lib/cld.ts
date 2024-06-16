import { v2 as cloudinary } from "cloudinary";

(async function () {
  // Configuration
  cloudinary.config({
    cloud_name: "dvovo1lfg",
    api_key: "984692373379189",
    api_secret: "UOQ9byFO87Q_6zOdxRyYKfwbJEk",
  });
})();

export const UploadImage = async (file: File, folder: string): Promise<any> => {
  const buffer = await file.arrayBuffer();
  const bytes = Buffer.from(buffer);
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "auto",
        folder: folder,
      },
      (err, result) => {
        if (err) {
          return reject(err.message);
        }
        resolve(result);
      }
    );
    uploadStream.end(bytes);
  });
};
