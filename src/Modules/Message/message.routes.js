import { Router } from "express";
import { verifyTokenMiddleware } from "../../Middleware/auth.middleware.js";
import * as controller from "./message.controller.js";
import { validation } from "../../Middleware/validation.middleware.js";
import { sendMessageSchema } from "./validation/message.validation.js";
const router = Router();
//messages i sent
router.get("/sent", verifyTokenMiddleware("strict"), controller.sentMessages);
// the messages sent to me
router.get("/inbox", verifyTokenMiddleware("strict"), controller.inbox);
router.get(
  "/inbox/unread",
  verifyTokenMiddleware("strict"),
  controller.unreadMessages,
);
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

//mark as read message
router.patch(
  "/:messageId/read",
  verifyTokenMiddleware("strict"),
  controller.markAsReadMessage,
);

export default router;
