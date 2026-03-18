import mongoose from "mongoose";
import { Schema } from "mongoose";

const messageSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },

    receiverId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null, // lw el sender is anonymous let db set senderId to null if not get the sender id from token of the logged in user(sender)
    },

    markAsRead: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const MessageModel = mongoose.model("Message", messageSchema);
