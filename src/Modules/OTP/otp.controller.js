import { successResponse } from "../../Utils/Response/success.response.js";
import { checkExistence } from "../Auth/auth.services.js";
import * as service from "./otp.services.js";
export const resendVerifyOTP = async (req, res, next) => {
  try {
    const { email } = req.body;
    await service.resendOTP(email, "verify");
    return successResponse({
      res,
      status: 200,
      message: "Please check your email to get OTP",
    });
  } catch (error) {
    next(error);
  }
};
