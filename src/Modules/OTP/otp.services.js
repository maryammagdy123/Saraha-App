import { otpRepo, userRepo } from "../../DB/Repo/index.js";
import { sendOTPEmail } from "../../Utils/email.utils.js";
import {
  BadRequestException,
  compare,
  hash,
  NotFoundException,
} from "../../Utils/index.js";
import { generateOTP } from "../../Utils/otp.utils.js";

export const generateAndSendOTP = async (email, type) => {
  const otp = generateOTP();
  const hashedOtp = await hash(otp);
  const otpDoc = await otpRepo.create({
    email,
    otp: hashedOtp,
    otpType: type,
    expiresAt: Date.now() + 5 * 60 * 1000,
  });
  await sendOTPEmail(
    email,
    otp,
    "Your Account OTP  verification code , note that otp will expire in 5 munites",
  );
  console.log(otpDoc);
  return otpDoc;
};

export const verifyOTP = async (otp, email, type) => {
  //check if user has an otp
  const otpDoc = otpRepo.findOne({ filter: { email, type } });
  const isCompare = await compare(otp, otpDoc.otp);
  if (!otpDoc) {
    BadRequestException({ message: "OTP has expired" });
  }

  //check if the otp entered by user matches the one in the db
  if (!isCompare) {
    BadRequestException({ message: "Invalid OTP" });
  }

  const user = await userRepo.find({
    filter: {
      email,
    },
  });
  if (!user) {
    NotFoundException({ message: "User Not found" });
  }
  user.isConfirmed = true;
  await user.save();
  return user;
};
