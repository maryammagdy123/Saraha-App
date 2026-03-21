import { Router } from "express";
import * as controller from "./user.controller.js";
import { verifyTokenMiddleware } from "../../Middleware/auth.middleware.js";
import { validation } from "../../Middleware/validation.middleware.js";
import {
  changePasswordSchema,
  updateProfileSchema,
} from "./user.validation.js";

import { fileValidation } from "../../Middleware/file-validation.middleware.js";
import {
  allowedFormat,
  uploadFiles,
} from "../../Utils/Multer/local.multer.utils.js";

const router = Router();

router.get("/profile", verifyTokenMiddleware("strict"), controller.profile);
router.patch(
  "/profile",
  verifyTokenMiddleware("strict"),
  validation(updateProfileSchema),
  controller.updateProfile,
);
router.patch(
  "/profile/password",
  verifyTokenMiddleware("strict"),
  validation(changePasswordSchema),
  controller.updatePassword,
);
//==========================upload files locally=========================================================
router.patch(
  "/profile/profile-picture",
  verifyTokenMiddleware("strict"),
  uploadFiles("/profile-pic", [...allowedFormat.image], 10).single("image"),
  fileValidation,
  controller.profilePic,
);
router.patch(
  "/profile/cover-picture",
  verifyTokenMiddleware("strict"),
  uploadFiles("/cover-pic", [...allowedFormat.image], 10).single("coverPhoto"),
  fileValidation,
  controller.coverPhoto,
);

// router.patch(
//   "/profile/cover-photo",
//   verifyTokenMiddleware("strict"),
//   uploadFiles("user/cover-photo", [...allowedFormat.image], 10).array(
//     "cover",
//     2,
//   ),
//   fileValidation,
//   controller.coverPhoto,
// );
router.delete(
  "/profile",
  verifyTokenMiddleware("strict"),
  controller.deleteProfile,
);

export default router;
