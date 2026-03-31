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

    const result = await service.login(email, password);
    // const accessToken = generateToken({ id: user._id });
    // const refreshToken = generateToken(
    //   { id: user._id },
    //   REFRESH_TOKEN_SECRET_KEY,
    //   REFRESH_EXPIRES_IN,
    // );

    return successResponse({
      res,
      status: 200,
      message: "Done",
      data: {
        result,
      },
    });
  } catch (error) {
    next(error);
  }
};
export const verify2FA = async (req, res, next) => {
  try {
    const result = await service.verify2FA(req.body);
    return successResponse({
      res,
      status: 200,
      message: "Login successfully!",
      data: {
        result,
      },
    });
  } catch (error) {
    next(error);
  }
};
//signup with gmail
export const signupWithGoogle = async (req, res, next) => {
  try {
    //id token =>comes from client side (FE)=>req.body
    console.log(req.body);
    const result = await service.signupWithGoogle(req.body);
    successResponse({
      res,
      status: 201,
      message: "done",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
//login with google
export const loginWithGoogle = async (req, res, next) => {
  try {
    //id token =>comes from client side (FE)=>req.body
    console.log(req.body);
    const result = await service.loginWithGoogle(req.body);
    successResponse({
      res,
      status: 200,
      message: "done",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
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
export const forgotPasswordLink = async (req, res, next) => {
  try {
    const result = await service.forgotPassword(req.body);
    return successResponse({
      res,
      status: 200,
      message: "If this email exists, a reset link has been sent",
      data: {
        result,
      },
    });
  } catch (error) {
    next(error);
  }
};
export const resetPasswordWithToken = async (req, res, next) => {
  try {
    const result = await service.resetPassword(req.body);
    return successResponse({
      res,
      status: 200,
      message: "Password reset successfully",
      data: {
        result,
      },
    });
  } catch (error) {
    next(error);
  }
};
export const logout = async (req, res, next) => {
  try {
    const userId=req.user._id;
    const token=req.headers.authorization;
    const{refreshToken}=req.body;
    await service.logout(userId,token,refreshToken);
    return successResponse({
      res,
      status: 200,
      message: "Logged out successfully!",
    });
  } catch (error) {
    next(error);
  }
};
