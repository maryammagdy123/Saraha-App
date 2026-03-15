import { Router } from "express";
import * as controller from "./user.controller.js";
import { verifyTokenMiddleware } from "../../Middleware/auth.middleware.js";
import { validation } from "../../Middleware/validation.middleware.js";
import {
  changePasswordSchema,
  updateProfileSchema,
} from "./user.validation.js";
import { uploadFiles } from "../../Utils/multer.utils.js";
import { fileValidation } from "../../Middleware/file-validation.middleware.js";

const router = Router();

router.get("/profile", verifyTokenMiddleware("strict"), controller.profile);
router.patch(
  "/profile",
  verifyTokenMiddleware("strict"),
  validation(updateProfileSchema),
  controller.updateProfile,
);
router.put(
  "/profile/password",
  verifyTokenMiddleware("strict"),
  validation(changePasswordSchema),
  controller.updatePassword,
);
router.put(
  "/profile/upload-profile-picture",
  verifyTokenMiddleware("strict"),
  uploadFiles().single("profile-picture"),
  fileValidation,
  controller.profilePic,
);
router.delete(
  "/profile",
  verifyTokenMiddleware("strict"),
  controller.deleteProfile,
);

export default router;
