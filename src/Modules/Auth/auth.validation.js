// validation schema
import Joi from "joi";
import { RoleEnum } from "../../Utils/Enums/user.enums.js";

// reusable fields
const email = Joi.string().email().required();

const password = Joi.string()
  .min(6)
  .max(30)
  .pattern(/^[a-zA-Z0-9@#$%^&+=]*$/)
  .required()
  .messages({
    "string.empty": "Password is required",
    "string.min": "Password must be at least 6 characters",
    "string.pattern.base": "Password contains invalid characters",
  });

const confirmPassword = Joi.string()
  .valid(Joi.ref("password"))
  .required()
  .messages({
    "any.only": "Passwords do not match",
    "string.empty": "Confirm password is required",
  });

const username = Joi.string().min(3).max(30).required();

// ==========================
// Register Schema
// ==========================
export const registerSchema = Joi.object({
  username,
  email,
  password,

  role: Joi.number()
    .valid(...Object.values(RoleEnum))
    .default(RoleEnum.User),
});

// ==========================
//  Login Schema
// ==========================
export const loginSchema = Joi.object({
  email,
  password,
});

// ==========================
//  Confirm OTP Schema
// ==========================
export const confirmOtpSchema = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.string().length(6).required(),
});

export const resetPasswordSchema = Joi.object({
  password,
  confirmPassword,
});
