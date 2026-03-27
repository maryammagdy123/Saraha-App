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
import { uploadFiles } from "../../Utils/Multer/local.multer.utils.js";

const router = Router();
//public routes
router.post(
  "/signup",
  uploadFiles().none(),
  validation(registerSchema, "body"),
  controller.signup,
);
router.post("/login", validation(loginSchema, "body"), controller.login);

router.post("/verify-2FA-otp", controller.verify2FA);
router.post("/signup/gmail", controller.signupWithGoogle);
router.post("/login/gmail", controller.loginWithGoogle);
router.patch(
  "/account/verify-account",
  validation(confirmOtpSchema, "body"),
  controller.accountVerification,
);
router.post("/forgot-password/send-otp", controller.sendForgotPasswordOTP);
router.patch("/reset-password/confirm-otp", controller.confirmResetPassOTP);
// router.patch(
//   "/reset-password",
//   validation(resetNewPassword, "body"),
//   controller.resetNewPassword,
// );
/*===========Protected routes============= */
router.get("/refresh-token", controller.refreshToken);
export default router;
