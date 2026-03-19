import mongoose, { Schema } from "mongoose";

const OtpSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    otp:{
        type:String,
        required:true
    },
    
    otpType: {
      type: String,
      enum: ["verify", "reset"],
      required: true,
    },
    attempts: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);
OtpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const OtpModel = mongoose.model("OTP", OtpSchema);
