import { Router } from "express";
import * as controller from "./auth.controller.js";
import { verifyTokenMiddleware } from "../../Middleware/auth.middleware.js";
import { validation } from "../../Middleware/validation.middleware.js";
import {
  confirmOtpSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
} from "./auth.validation.js";
import { uploadFiles } from "../../Utils/multer.utils.js";

const router = Router();
//public routes
router.post(
  "/signup",
  uploadFiles().none(),
  validation(registerSchema, "body"),
  controller.signup,
);
router.post("/login", validation(loginSchema, "body"), controller.login);
// router.post("login-with-google", controller.loginWithGoogle);
router.patch(
  "/account/verify-account",
  validation(confirmOtpSchema, "body"),
  controller.accountVerification,
);
router.patch(
  "/reset-password",
  validation(resetPasswordSchema, "body"),
  controller.resetPassword,
);
/*===========Protected routes============= */
// router.post(
//   "/refresh-token",
//   verifyTokenMiddleware("strict"),
//   controller.refreshToken,
// );
export default router;
