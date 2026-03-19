import { otpRepo } from "../../DB/Repo/index.js";
import { sendOTPEmail } from "../../Utils/email.utils.js";
import { hash } from "../../Utils/index.js";
import { generateOTP } from "../../Utils/otp.utils.js";

export const generateAndSendOTP = async (email, type) => {
  const otp = generateOTP();
  const hashedOtp = await hash(otp);
  const otpDoc = otpRepo.create({
    email,
    otp: hashedOtp,
    otpType: type,
    expiresAt: Date.now() + 5 * 1000,
  });
  await sendOTPEmail(user.email, otp, "Your Account OTP  verification code");
  console.log(otpDoc);
  return otpDoc;
};
