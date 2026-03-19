import { Router } from "express";
import * as controller from "./otp.controller.js";
const router = Router();
router.patch("/verify-email", controller.verifyEmail);
export default router;
