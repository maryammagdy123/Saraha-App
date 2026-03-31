import { checkKeyExistence } from "../../DB/redis/redis.helper.js";
import { otpRepo, userRepo } from "../../DB/Repo/index.js";
import { sendOTPEmail } from "../../Utils/email.utils.js";
import {
  BadRequestException,
  compare,
  hash,
  NotFoundException,
} from "../../Utils/index.js";
import { generateOTP } from "../../Utils/otp.utils.js";
import { checkExistence, } from "../Auth/auth.services.js";
export const getSubjectByType = (type) => {
  switch (type) {
    case "verify":
      return "Verify Your Account";
    case "reset":
      return "Reset Your Password";
    case "2FA":
      return "2 Factor Authentication";
    default:
      return "Your OTP Code";
  }
};
const expiresAtByType = (type) => {
  switch (type) {
    case "reset":
      return new Date(Date.now() + 10 * 60 * 1000);
    default:
      return new Date(Date.now() + 5 * 60 * 1000);
  }
};
export const generateAndSendOTP = async (email, type) => {
  const userExist = await checkKeyExistence(email);
  const existInDB = await checkExistence(email);
  if (userExist !== 1 && !existInDB) {
    NotFoundException({ message: "User Not found Cannot send OTP ...!" });
  }
  const otp = generateOTP();
  const hashedOtp = await hash(otp);
  const otpDoc = await otpRepo.create({
    email,
    otp: hashedOtp,
    otpType: type,
    expiresAt: expiresAtByType(type),
  });
  await sendOTPEmail(email, otp, getSubjectByType(type));
  console.log(otpDoc);
  return otpDoc;
};

export const resendOTP = async (email, type) => {
  const userExist = await checkKeyExistence(email);
  const existInDB = await checkExistence(email);
  if (userExist !== 1 || !existInDB) {
    throw new Error("cannot send otp!");
  }
  const isOTPExistBefore = await otpRepo.findOne({
    filter: { email, otpType: type },
  });
  if (isOTPExistBefore) {
    BadRequestException({
      message: "We already sent you an otp and its still valid!",
    });
  }
  const otp = await generateAndSendOTP(email, type);
  return otp;
};

export const verifyOTP = async (otp, type, email) => {
  //check if user has an otp
  const filter = { otpType: type, email };

  const otpDoc = await otpRepo.findOne({
    filter,
  });

  if (!otpDoc) {
    BadRequestException({ message: "OTP has expired" });
  }
  const isCompare = await compare(otp, otpDoc.otp);

  //check if the otp entered by user matches the one in the db
  if (!isCompare) {
    otpDoc.attempts += 1;
    if (otpDoc.attempts > 3) {
      await otpRepo.deleteOne({ email, otpType: type });
      BadRequestException({
        message:
          "Oops! You've reached the maximum number of attempts. Please request a new OTP",
      });
    }
    await otpDoc.save();
    BadRequestException({ message: "Invalid OTP" });
  }

  return true;
};
