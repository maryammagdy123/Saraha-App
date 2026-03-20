import { Router } from "express";
import * as controller from "./otp.controller.js";
const router = Router();
router.patch("/verify-email", controller.verifyEmail);
router.post("/resend-otp", controller.resendVerifyOTP);
export default router;
