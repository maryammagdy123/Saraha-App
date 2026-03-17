import fs from "node:fs";
import multer, { diskStorage } from "multer";
import { BadRequestException } from "./Response/error.response.js";
import { resolve } from "node:path";
export const allowedFormat = {
  image: ["image/png", "image/jpg", "image/jpeg", "image/gif"],
  video: ["video/mp4"],
};
export const uploadFiles = (
  customPath = "general",
  validation = [],
  size = 5,
) => {
  return multer({
    fileFilter: (req, file, cb) => {
      if (!allowedFormat.includes(file.mimetype)) {
        return cb(
          BadRequestException({ message: "Invalid file format!" }),
          false,
        );
      }

      cb(null, true);
    },
    storage: diskStorage({
      destination: (req, file, cb) => {
        let filePath = resolve(`upload ${customPath}`);
        if (!fs.existsSync(filePath)) {
          fs.mkdirSync(filePath, { recursive: true });
        }
        cb(null, filePath);
      },
      filename: (req, file, cb) => {
        let customFileName =
          Date.now() + Math.random() + "__" + file.originalname;
        file.finalPath = `upload/${customPath}/${customFileName}`;
        cb(null, customFileName);
      },
    }),
  });
};

/**filename:(req,file,cn)=>{}
 * file returns an object => fieldname,originalname,encoding,mimetype
 */
