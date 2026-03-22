import { v2 as cloudinary } from "cloudinary";
import {
  APP_NAME,
  CLOUD_API_KEY,
  CLOUD_API_SECRET,
  CLOUD_NAME,
} from "../../../config/config.service.js";

cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: CLOUD_API_KEY,
  api_secret: CLOUD_API_SECRET,
});

export const uploadFile = async ({ file, folder }) => {
  return await cloudinary.uploader.upload(file.path, {
    folder: `${APP_NAME}/${folder}`,
  });
};

export const uploadFiles = async ({ files, folder }) => {
  let attachments = [];
  for (const file of files) {
    const { public_id, secure_url } = await cloudinary.uploader.upload(
      file.path,
      {
        folder: `${APP_NAME}/${folder}`,
      },
    );
    attachments.push({ public_id, secure_url });
  }
  return attachments;
};
export const destroyFile = async (public_id) => {
  return await cloudinary.uploader.destroy(public_id);
};
export default cloudinary;
