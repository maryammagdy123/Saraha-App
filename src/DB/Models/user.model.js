import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    profilePicture: {
      type: String,
      required: false,
    },
    username: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },

    isConfirmed: {
      type: Boolean,
      default: false,
    },



    publicKey: {
      type: String,
      required: true,
    },

    privateKey: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

export const UserModel = mongoose.model("User", userSchema);
