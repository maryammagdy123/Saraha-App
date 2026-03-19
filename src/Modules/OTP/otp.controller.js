import { successResponse } from "../../Utils/Response/success.response.js";
import * as service from "./otp.services.js";
export const verifyEmail = async (req, res, next) => {
  try {
    const verified = await service.verifyOTP(req.body, "verify");
    return successResponse({
      res,
      status: 200,
      message: "Your Account verified successfully !",
      data: { verified: verified.acknowledged },
    });
  } catch (error) {
    next(error);
  }
};

export const resendOTP = async (req, res, next) => {
  try {
    const { email } = req.body;
    await service.resendOTP(email);
    return successResponse({
      res,
      status: 200,
      message: "Please check your email to get OTP",
    });
  } catch (error) {
    next(error);
  }
};
