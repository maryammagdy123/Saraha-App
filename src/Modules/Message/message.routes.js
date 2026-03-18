import { Router } from "express";
import { verifyTokenMiddleware } from "../../Middleware/auth.middleware.js";
import * as controller from "./message.controller.js";
import { validation } from "../../Middleware/validation.middleware.js";
import { sendMessageSchema } from "./validation/message.validation.js";
const router = Router();
router.get("/sent", verifyTokenMiddleware("strict"), controller.sentMessages); //messages i sent
router.get("/inbox", verifyTokenMiddleware("strict"), controller.inbox); // the messages sent to me
router.post(
  "/:receiverId",
  verifyTokenMiddleware("strict"),
  validation(sendMessageSchema, "body"),
  controller.message,
);
router.post(
  "/anonymous/:receiverId",
  verifyTokenMiddleware("optional"),
  validation(sendMessageSchema, "body"),
  controller.anonymousMessage,
);

export default router;
