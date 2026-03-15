import fs from "node:fs";
import multer, { diskStorage } from "multer";
import { BadRequestException } from "./Response/error.response.js";
export const uploadFiles = (
  allowedFormat = ["image/png", "image/jpg", "image/jpeg", "image/gif"],
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
        if (!fs.existsSync(`upload/${req.user.id}`)) {
          fs.mkdirSync(`upload/${req.user.id}`);
        }
        cb(null, `upload/${req.user.id}`);
      },
      filename: (req, file, cb) => {
        cb(null, Date.now() + Math.random() + "__" + file.originalname);
      },
    }),
  });
};

/**filename:(req,file,cn)=>{}
 * file returns an object => fieldname,originalname,encoding,mimetype
 */
