import { Router } from "express";
import * as controller from "./otp.controller";
const router = Router();
router.post("/verify-email", controller.verifyEmail);
export default router;
