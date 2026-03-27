import {
  CLIENT_ID,
  REFRESH_EXPIRES_IN,
  REFRESH_TOKEN_SECRET_KEY,
} from "../../../config/config.service.js";
import { redisClient } from "../../DB/index.js";
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
  verifyToken,
} from "../../Utils/index.js";
import { OAuth2Client } from "google-auth-library";
import { generateAndSendOTP, verifyOTP } from "../OTP/otp.services.js";
import { getUserWithNoSensitiveData } from "../User/user.services.js";
import { ProviderEnum, RoleEnum } from "../../Utils/Enums/user.enums.js";

export const checkExistence = async (email) => {
  return await userRepo.findOne({ filter: { email } });
};
export const checkKeyExistence = async (key) => {
  return await redisClient.exists(key);
};
const getFromCache = async (key) => {
  const cached = await redisClient.get(key);
  if (cached) return JSON.parse(cached);
  return null;
  //returns key value or null
};
const saveInCache = async (key, value, ex = 1 * 24 * 60 * 60) => {
  value = JSON.stringify(value);
  return redisClient.set(key, value, {
    EX: ex,
  });
  //returns" ok" if success
};
//SIGNUP AND SAVING USERS INTO REDIS CACHE UNTIL THEY VERIFY THEIR ACCOUNTS THEN SAVING THEM INTO DB
export const signup = async (userData) => {
  const keyExist = await checkKeyExistence(userData.email);
  const userExist = await checkExistence(userData.email);

  if (keyExist === 1 || userExist) {
    ConflictException({
      message: "This email is already in use!",
    });
  }

  const { privateKey, publicKey } = generateKeyPair();
  const hashedPassword = await hash(userData.password);
  userData.password = hashedPassword;

  //save user into cache
  const result = await saveInCache(userData.email, {
    ...userData,
    privateKey,
    publicKey,
  });
  //send otp to users email
  await generateAndSendOTP(userData.email, "verify");
  //return users data
  return result;
};

//SIGNUP AND SAVING USERS INTO DB BEFORE ACCOUNT BEING VERIFIED
// export const signup = async (userData) => {
//   const userExist = await checkExistence(userData.email);
//   if (userExist && userExist.isConfirmed) {
//     ConflictException({
//       message: "This email is already verified, please login instead!",
//     });
//   }

//   if (userExist && userExist.isConfirmed === false) {
//     ConflictException({
//       message: "This email is already in use!",
//     });
//   }
//   const { privateKey, publicKey } = generateKeyPair();
//   const hashedPassword = await hash(userData.password);

//   const user = await userRepo.create({
//     username: userData.username,
//     email: userData.email,
//     password: hashedPassword,
//     publicKey: publicKey,
//     privateKey: privateKey,
//   });

//   await generateAndSendOTP(userData.email, "verify");
//   const result = {
//     id: user._id,
//     username: user.username,
//     email: user.email,
//     isConfirmed: user.isConfirmed,
//   };
//   return result;
// };

export const login = async (email, password) => {
  let existUser = await userRepo.findOne({ filter: { email } });
  const accessToken = generateToken({ id: existUser._id });
  const refreshToken = generateToken(
    { id: existUser._id },
    REFRESH_TOKEN_SECRET_KEY,
    REFRESH_EXPIRES_IN,
  );
  if (!existUser) {
    NotFoundException({ message: "You don't have account , signup first!" });
  }

  const isCompare = await compare(password, existUser.password);
  if (!isCompare) {
    InvalidCredentialsException({ message: "Email or password is invalid!" });
  }
  if (existUser.twoFAisEnabled === true) {
    await generateAndSendOTP(email, "2FA");
    return "You have received a 2 factor authentication code on your email !";
  }
  return {
    accessToken,
    refreshToken,
  };
};
export const verify2FA = async (body) => {
  let { otp, email } = body;
  const user = await checkExistence(email);
  await verifyOTP(otp, "2FA", email);
  const accessToken = generateToken({ id: user._id });
  const refreshToken = generateToken(
    { id: user._id },
    REFRESH_TOKEN_SECRET_KEY,
    REFRESH_EXPIRES_IN,
  );
  return {
    accessToken,
    refreshToken,
  };
};

//login via google
export const loginWithGoogle = async ({ idToken }) => {
  const client = new OAuth2Client();

  const ticket = await client.verifyIdToken({
    idToken,
    audience: CLIENT_ID,
  });
  const payload = ticket.getPayload();
  const user = await userRepo.findOne({
    filter: {
      email: payload.email,
      provider: ProviderEnum.Google,
    },
  });
  if (!user) {
    NotFoundException({
      message: "You don't have account with this email , please signup first!",
    });
  }
  if (user.twoFAisEnabled) {
    await generateAndSendOTP(user.email, "2FA");
    return "You have received a 2 factor authentication code on your email !";
  }
  const accessToken = generateToken({ id: user._id });
  const refreshToken = generateToken(
    { id: user._id },
    REFRESH_TOKEN_SECRET_KEY,
    REFRESH_EXPIRES_IN,
  );
  return {
    accessToken,
    refreshToken,
  };
};
//signup via google
export const signupWithGoogle = async ({ idToken }) => {
  const { privateKey, publicKey } = generateKeyPair();
  const client = new OAuth2Client();

  const ticket = await client.verifyIdToken({
    idToken,
    audience: CLIENT_ID,
  });
  const payload = ticket.getPayload();
  const isUserExist = await checkExistence(payload.email);
  console.log(payload);
  if (!payload?.email_verified) {
    BadRequestException({ message: "Google failed verify your account!!!" });
  }
  if (isUserExist) {
    if (isUserExist.provider === ProviderEnum.System) {
      ConflictException({
        message: "You already have an account with different provider!!",
      });
    }

    //redirect to login with google
    return await loginWithGoogle({ idToken });
  }

  const user = await userRepo.create({
    username: payload.name,
    email: payload.email,
    provider: ProviderEnum.Google,
    isConfirmed: payload.email_verified,
    profilePicture: payload.picture,
    publicKey,
    privateKey,
  });

  return user;
};

export const refreshToken = async (authorization) => {
  const decoded = verifyToken(authorization, REFRESH_TOKEN_SECRET_KEY);
  const user = await userRepo.findById({ id: decoded.id });
  if (!user) {
    NotFoundException({ message: "User Not Found!" });
  }
  const accessToken = generateToken({ id: user._id });
  return accessToken;
};

//GETTING USER FROM CACHE TO VERIFY THEIR ACCOUNTS THEN SAVING THEM INTO DB
export const verifyAccount = async (email, otp, type) => {
  //check email existence
  const user = await getFromCache(email);
  const confirmedInDB = await checkExistence(email);
  if (confirmedInDB?.isConfirmed === true) {
    BadRequestException({ message: "Your account already verified!" });
  }

  if (user === null) {
    NotFoundException({
      message: "No such account found please create account first!",
    });
  }

  //verify otp
  await verifyOTP(otp, type, email);
  //save user into db  => isConfirmed -- true
  const createdUser = await userRepo.create({
    ...user,
    isConfirmed: true,
  });
  console.log(createdUser);

  await otpRepo.deleteOne({ email, otpType: type });
  await redisClient.del(email);

  return getUserWithNoSensitiveData(createdUser);
};

// export const verifyAccount = async (email, otp, type) => {
//   //check email existence
//   const userExist = await checkExistence(email);
//   if (!userExist) {
//     NotFoundException({
//       message: "No such account found please create account first!",
//     });
//   }

//   //verify otp
//   await verifyOTP(otp, type, email);
//   const updatedUser = await userRepo.updateOne({
//     filter: { email },
//     update: { isConfirmed: true },
//   });
//   if (updatedUser) {
//     await otpRepo.deleteOne({ email, otpType: type });
//   }
//   return updatedUser;
// };

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

export const forgotPasswordOTP = async (body) => {
  let { email } = body;
  const user = await checkExistence(email);
  if (!user) {
    NotFoundException({
      message: "Please make sure you have account with this email!",
    });
  }
  await generateAndSendOTP(email, "reset");
};

export const confirmForgotPasswordOTP = async (body) => {
  let { email, otp, password, confirmPassword } = body;
  let user = await checkExistence(email);
  if (!user) {
    NotFoundException({
      message: "Incorrect email!!",
    });
  }
  await verifyOTP(otp, "reset", email);
  if (password !== confirmPassword) {
    BadRequestException({ message: "Password does not match!" });
  }
  const hashedPassword = await hash(password);
  user.password = hashedPassword;
  await user.save();
  await otpRepo.deleteOne({ email, otpType: "reset" });
};
