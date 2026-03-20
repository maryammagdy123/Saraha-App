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
    //retrieve decoded token (having users id)
    const userId = req.user._id; //=>> gaya mn el verify => decoded=>>comes from auth middleware
    //calling services
    const accessToken = service.refreshToken(userId);
    return successResponse({
      res,
      status: 201,
      message: "Token refreshed successfully!",
      data: {
        refreshToken: accessToken,
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
      data: { status: result.acknowledged },
    });
  } catch (error) {
    next(error);
  }
};
export const resetPassword = async (req, res, next) => {
  try {
    const { email, password, confirmPassword } = req.body;
    await service.forgotPassword(email, password, confirmPassword);
    return successResponse({
      res,
      status: 200,
      message: "Your password has been successfully reset!",
      data: { status: result.acknowledged },
    });
  } catch (error) {
    next(error);
  }
};
