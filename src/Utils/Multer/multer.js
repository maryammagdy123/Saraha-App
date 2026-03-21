import multer, { diskStorage } from "multer";
import { BadRequestException } from "../Response/error.response.js";
export const allowedFormat = {
  image: ["image/png", "image/jpg", "image/jpeg", "image/gif"],
  video: ["video/mp4"],
};
export const cloudUploads = (validation = [], size = 5) => {
  return multer({
    fileFilter: (req, file, cb) => {
      if (!validation.includes(file.mimetype)) {
        return cb(
          BadRequestException({ message: "Invalid file format!" }),
          false,
        );
      }

      cb(null, true);
    },
    storage: diskStorage({}),
  });
};
