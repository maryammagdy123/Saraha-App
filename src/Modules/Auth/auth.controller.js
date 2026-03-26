import {
  REFRESH_EXPIRES_IN,
  REFRESH_TOKEN_SECRET_KEY,
} from "../../../config/config.service.js";
import {
  ConflictException,
  generateToken,
  successResponse,
} from "../../Utils/index.js";
import * as service from "./auth.services.js";
export const signup = async (req, res, next) => {
  try {
    // const isExist = await service.checkExistence(req.body.email);
    // console.log(req.body.email);
    // if (isExist) {
    //   ConflictException({ message: "User already exist, login instead!" });
    // }
    const user = await service.signup(req.body);
    return successResponse({
      res,
      status: 201,
      message:
        "User signup successfully , please check your email to confirm otp  ",
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};
export const login = async (req, res, next) => {
  try {
    let { email, password } = req.body;

    const user = await service.login(email, password);
    const accessToken = generateToken({ id: user._id });
    const refreshToken = generateToken(
      { id: user._id },
      REFRESH_TOKEN_SECRET_KEY,
      REFRESH_EXPIRES_IN,
    );

    return successResponse({
      res,
      status: 200,
      message: "User Logged in successfully",
      data: { token: accessToken, refreshToken },
    });
  } catch (error) {
    next(error);
  }
};
// export const loginWithGoogle = async (req, res, next) => {
//   try {
//   } catch (error) {
//     next(error);
//   }
// };
export const refreshToken = async (req, res, next) => {
  try {
    const accessToken = await service.refreshToken(req.headers.authorization);
    // console.log(accessToken);
    return successResponse({
      res,
      status: 201,
      message: "Token refreshed successfully!",
      data: {
        token: accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};
export const accountVerification = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const result = await service.verifyAccount(email, otp, "verify");
    console.log(result);
    return successResponse({
      res,
      status: 200,
      message: "Your email confirmed successfully",
      data: { result },
    });
  } catch (error) {
    next(error);
  }
};

export const sendForgotPasswordOTP = async (req, res, next) => {
  try {
    await service.forgotPasswordOTP(req.body);
    return successResponse({
      res,
      status: 200,
      message: "Reset Password OTP sent to your email successfully!",
    });
  } catch (error) {
    next(error);
  }
};

export const confirmResetPassOTP = async (req, res, next) => {
  try {
    await service.confirmForgotPasswordOTP(req.body);
    return successResponse({
      res,
      status: 200,
      message: "Your password reset successfully!",
      data: {
        result: true,
      },
    });
  } catch (error) {
    next(error);
  }
};

// export const resetNewPassword = async (req, res, next) => {
//   try {
//     const { password, confirmPassword, email } = req.body;
//     const result = await service.resetPassword(
//       password,
//       confirmPassword,
//       email,
//     );
//     return successResponse({
//       res,
//       status: 200,
//       message: "Your password changed successfully!",
//       data: {
//         result: result.acknowledged,
//       },
//     });
//   } catch (error) {
//     next(error);
//   }
// };
