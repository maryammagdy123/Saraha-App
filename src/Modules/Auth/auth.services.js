import { userRepo } from "../../DB/Repo/index.js";
import { sendOTPEmail } from "../../Utils/email.utils.js";
import {
  AlreadyConfirmed,
  BadRequestException,
  compare,
  ConflictException,
  generateKeyPair,
  generateToken,
  hash,
  InvalidCredentialsException,
  NotFoundException,
} from "../../Utils/index.js";
import { generateOTP } from "../../Utils/otp.utils.js";
import { generateAndSendOTP } from "../OTP/otp.services.js";

export const checkExistence = async (email) => {
  return await userRepo.findOne({ filter: { email } });
};

export const signup = async (userData) => {
  const { privateKey, publicKey } = generateKeyPair();
  const otp = await generateAndSendOTP(userData.email, "verify");
  const userExist = await checkExistence(userData.email);
  if (userExist) {
    ConflictException({ message: "This email already in use!!" });
  }
  const hashedPassword = await hash(userData.password);

  const user = await userRepo.create({
    username: userData.username,
    email: userData.email,
    password: hashedPassword,
    publicKey: publicKey,
    privateKey: privateKey,
  });

  const result = {
    id: user._id,
    username: user.username,
    email: user.email,
    isConfirmed: user.isConfirmed,
  };
  return result;
};
// export const confirmOtp = async (email, otp) => {
//   const user = await userRepo.findOne({ filter: { email } });
//   if (!user) {
//     NotFoundException({ message: "User Not Found" });
//   }

//   if (user.isConfirmed) {
//     AlreadyConfirmed({ message: "User already confirmed!" });
//   }
//   if (!user.otp || !user.otpExpires) {
//     BadRequestException({ message: "No OTP found" });
//   }

//   if (user.otpExpires < Date.now()) {
//     user.otp = null;
//     user.otpExpires = null;
//     await user.save();
//     BadRequestException({ message: "OTP has expired" });
//   }

//   const isCompare = await compare(otp, user.otp);

//   if (!isCompare) {
//     BadRequestException({ message: "Invalid OTP" });
//   }

//   user.isConfirmed = true;
//   user.otp = null;
//   user.otpExpires = null;

//   await user.save();

//   return user;
// };
export const login = async (email, password) => {
  let existUser = await userRepo.findOne({ filter: { email } });
  if (!existUser) {
    NotFoundException({ message: "You dont have account ,signup first!!" });
  }
  if (!existUser.isConfirmed) {
    BadRequestException({ message: "Please confirm you email first!" });
  }

  const isCompare = await compare(password, existUser.password);
  if (!isCompare) {
    InvalidCredentialsException({ message: "Email or password is invalid!" });
  }

  return existUser;
};

export const loginWithGoogle = async () => {};
export const refreshToken = async (userId) => {
  const user = await userRepo.findById({ id: userId });
  if (!user) {
    NotFoundException({ message: "User Not Found!" });
  }
  const accessToken = generateToken({ id: user._id });
  return accessToken;
};
