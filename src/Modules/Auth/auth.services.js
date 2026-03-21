import { otpRepo, userRepo } from "../../DB/Repo/index.js";
import {
  BadRequestException,
  compare,
  ConflictException,
  generateKeyPair,
  generateToken,
  hash,
  InvalidCredentialsException,
  NotFoundException,
} from "../../Utils/index.js";

import { generateAndSendOTP, verifyOTP } from "../OTP/otp.services.js";

export const checkExistence = async (email) => {
  return await userRepo.findOne({ filter: { email } });
};

export const signup = async (userData) => {
  const userExist = await checkExistence(userData.email);
  if (userExist && userExist.isConfirmed) {
    ConflictException({
      message: "This email is already verified, please login instead!",
    });
  }

  if (userExist && userExist.isConfirmed === false) {
    ConflictException({
      message: "This email is already in use!",
    });
  }
  const { privateKey, publicKey } = generateKeyPair();
  const hashedPassword = await hash(userData.password);

  const user = await userRepo.create({
    username: userData.username,
    email: userData.email,
    password: hashedPassword,
    publicKey: publicKey,
    privateKey: privateKey,
  });

  await generateAndSendOTP(userData.email, "verify");
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
export const verifyAccount = async (email, otp, type) => {
  //check email existence
  const userExist = await checkExistence(email);
  if (!userExist) {
    NotFoundException({
      message: "No such account found please create account first!",
    });
  }

  //verify otp
  await verifyOTP(otp, type, email);
  const updatedUser = await userRepo.updateOne({
    filter: { email },
    update: { isConfirmed: true },
  });
  if (updatedUser) {
    await otpRepo.deleteOne({ email });
  }
  return updatedUser;
};

// export const forgotPasswordOTP = async (email) => {
//   const user = await checkExistence(email);
//   if (!user) {
//     BadRequestException({
//       message: "Please make sure the email you entered is correct!!",
//     });
//   }
//   //check if user confirmed
//   if (!user.isConfirmed) {
//     BadRequestException({
//       message: "Your account is not verified yet , please verify it!",
//     });
//   }
//   await generateAndSendOTP(email, "reset");
//   return true;
// };

// export const resetPassOTPConfirmation = async (otp,email) => {
//   return await verifyOTP(otp, "reset",email);
// };
// export const resetPassword = async (password) => {

// };
