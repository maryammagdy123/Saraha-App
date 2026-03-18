import { successResponse } from "../../Utils/index.js";
import * as service from "./message.services.js";
export const message = async (req, res, next) => {
  try {
    const senderId = req.user._id;
    const { content } = req.body;
    const { receiverId } = req.params;
    const message = await service.sendMessage(senderId, receiverId, content);
    if (message)
      return successResponse({
        res,
        status: 201,
        message: "Your message sent successfully !",
        data: { message },
      });
  } catch (error) {
    next(error);
  }
};

export const inbox = async (req, res, next) => {
  try {
    const user = req.user;
    const messages = await service.getInboxMessages(user);
    return successResponse({
      res,
      status: 200,
      message: "Your messages fetched successfully !",
      data: { received: messages },
    });
  } catch (error) {
    next(error);
  }
};

export const sentMessages = async (req, res, next) => {
  try {
    const user = req.user;
    const messages = await service.getSentMessages(user);
    return successResponse({
      res,
      status: 200,
      message: "Your messages fetched successfully !",
      data: { sent: messages },
    });
  } catch (error) {
    next(error);
  }
};
export const anonymousMessage = async (req, res, next) => {
  try {
    const { content } = req.body;
    const { receiverId } = req.params;
    const message = await service.sendAnonymousMessage(receiverId, content);

    return successResponse({
      res,
      status: 201,
      message: "Your message sent successfully !",
      data: { message },
    });
  } catch (error) {
    next(error);
  }
};
export const markAsReadMessage = async (req, res, next) => {
  const { messageId } = req.params;
  const user = req.user;
  const readMessage = await service.readMessage(messageId, user);
  return successResponse({
    res,
    status: 200,
    message: "Message marked as read successfully",
    data: {
      message: readMessage,
    },
  });
};

export const unreadMessages = async (req, res, next) => {
  const user = req.user;
  const { count, unreadMessages } = await service.getUnreadMessages(user);
  return successResponse({
    res,
    status: 200,
    message: "Message marked as read successfully",
    data: {
      messages: unreadMessages,
      count,
    },
  });
};
