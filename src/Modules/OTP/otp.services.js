import { otpRepo, userRepo } from "../../DB/Repo/index.js";
import { sendOTPEmail } from "../../Utils/email.utils.js";
import {
  BadRequestException,
  compare,
  hash,
  NotFoundException,
} from "../../Utils/index.js";
import { generateOTP } from "../../Utils/otp.utils.js";
import { checkExistence } from "../Auth/auth.services.js";

export const generateAndSendOTP = async (email, type, subject) => {
  const userExist = await checkExistence(email);
  if (!userExist) {
    NotFoundException({ message: "User Not found Cannot send OTP ...!" });
  }
  const otp = generateOTP();
  const hashedOtp = await hash(otp);
  const otpDoc = await otpRepo.create({
    email,
    otp: hashedOtp,
    otpType: type,
    expiresAt: Date.now() + 5 * 60 * 1000,
  });
  await sendOTPEmail(email, otp, subject);
  console.log(otpDoc);
  return otpDoc;
};

export const resendOTP = async (email, type) => {
  const isOTPExistBefore = await otpRepo.findOne({ filter: { email } });
  if (isOTPExistBefore) {
    BadRequestException({
      message: "We already sent you an otp and its still valid!",
    });
  }
  const otp = await generateAndSendOTP(email, type);
  return otp;
};

export const verifyOTP = async (body, type) => {
  const userExist = await checkExistence(body.email);
  if (!userExist) {
    NotFoundException({
      message: "No such account found please create account first!",
    });
  }
  //check if user has an otp
  const otpDoc = await otpRepo.findOne({
    filter: { email: body.email, otpType: type },
  });

  if (!otpDoc) {
    BadRequestException({ message: "OTP has expired" });
  }
  const isCompare = await compare(body.otp, otpDoc.otp);

  //check if the otp entered by user matches the one in the db
  if (!isCompare) {
    otpDoc.attempts += 1;
    if (otpDoc.attempts > 3) {
      await otpRepo.deleteOne({ email: body.email });
      BadRequestException({
        message:
          "Oops! You've reached the maximum number of attempts. Please request a new OTP",
      });
    }
    await otpDoc.save();
    BadRequestException({ message: "Invalid OTP" });
  }

  const updatedUser = await userRepo.updateOne({
    filter: { email: body.email },
    update: { isConfirmed: true },
  });
  if (updatedUser) {
    await otpRepo.deleteOne({ email: body.email });
  }
  return updatedUser;
};
