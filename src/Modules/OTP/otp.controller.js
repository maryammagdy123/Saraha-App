import { successResponse } from "../../Utils/Response/success.response.js";
import * as service from "./otp.services.js";
export const verifyEmail = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    await service.verifyOTP(otp, email, "verify");
    return successResponse({
      res,
      status: 200,
      message: "Your Account verified successfully !",
    });
  } catch (error) {
    next(error);
  }
};
