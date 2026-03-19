import { MessageModel, OtpModel, UserModel } from "../Models/index.js";
import { DBRepository } from "./db.repository.js";

export const userRepo = new DBRepository(UserModel);
export const messageRepo = new DBRepository(MessageModel);
export const otpRepo = new DBRepository(OtpModel);
