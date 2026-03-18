import { messageRepo, userRepo } from "../../DB/Repo/index.js";
import {
  BadRequestException,
  decryptMessage,
  encryptMessage,
  NotFoundException,
  UnauthorizedException,
} from "../../Utils/index.js";
const getDecryptedMessage = (messages, owner) => {
  const decryptedMessages = messages.map((msg) => {
    let decryptedContent;
    try {
      decryptedContent = decryptMessage(msg.content, owner.privateKey);
    } catch (error) {
      decryptedContent = "[Cannot decrypt message]";
    }

    return {
      ...msg.toObject(),
      content: decryptedContent,
    };
  });

  return decryptedMessages;
};

export const sendMessage = async (senderId, receiverId, message) => {
  const findReceiver = await userRepo.findById({ id: receiverId });

  if (!findReceiver) {
    NotFoundException({ message: "User Not Found!" });
  }

  const encryptedMessage = encryptMessage(message, findReceiver.publicKey);

  const result = await messageRepo.create({
    content: encryptedMessage,
    receiverId: receiverId,
    senderId: senderId,
  });

  return result;
};

export const sendAnonymousMessage = async (receiverId, message) => {
  const findReceiver = await userRepo.findById({ id: receiverId });

  if (!findReceiver) {
    NotFoundException({ message: "User Not Found!" });
  }

  const encryptedMessage = encryptMessage(message, findReceiver.publicKey);

  const result = await messageRepo.create({
    content: encryptedMessage,
    receiverId: receiverId,
  });

  return result;
};

//received messages(inbox)
export const getInboxMessages = async (user) => {
  const messages = await messageRepo.find({
    receiverId: user._id,
    populate: [
      {
        path: "senderId",
        select: "username email",
      },
    ],
    options: {
      sort: { createdAt: -1 },
    },
  });
  if (messages.length === 0) {
    BadRequestException({
      message: "You did not received any messages yet!",
    });
  }
  const decryptedMessages = getDecryptedMessage(messages, user);
  return decryptedMessages;
};

//sent messages
export const getSentMessages = async (user) => {
  const messages = await messageRepo.find({
    senderId: user._id,
    populate: [
      {
        path: "receiverId",
        select: "username email",
      },
    ],
    options: {
      sort: { createdAt: -1 },
    },
  });
  if (messages.length === 0) {
    BadRequestException({
      message: "You did not sent any messages yet!",
    });
  }
  const decryptedMessages = getDecryptedMessage(messages, user);
  return decryptedMessages;
};

//mark read messages
export const readMessage = async (messageId, receiver) => {
  const message = await messageRepo.findById({ id: messageId });

  if (!message) {
    NotFoundException({ message: "Message not found!" });
  }
  console.log(message.receiverId, receiver._id);
  if (message.receiverId.toString() !== receiver._id.toString()) {
    UnauthorizedException({ message: "You are not authorized!" });
  }
  if (message.markAsRead) {
    return message;
  }
  message.markAsRead = true;
  await message.save();
  return message;
};
