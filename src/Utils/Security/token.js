import jwt from "jsonwebtoken";
import {
  ACCESS_TOKEN_SECRET_KEY,
  ADMIN_ACCESS_TOKEN_SECRET_KEY,
  ADMIN_REFRESH_TOKEN_SECRET_KEY,
  REFRESH_TOKEN_SECRET_KEY,
  TOKEN_EXPIRES_IN,
} from "../../../config/config.service.js";
import { SignatureEnum } from "../Enums/user.enums.js";

export const generateToken = (
  payload,
  secretKey = ACCESS_TOKEN_SECRET_KEY,
  expiresIn = TOKEN_EXPIRES_IN,
) => {
  return jwt.sign(payload, secretKey, { expiresIn: String(expiresIn) });
};
//this function generates token and return it

export const verifyToken = (token, secretKey = ACCESS_TOKEN_SECRET_KEY) => {
  return jwt.verify(token, secretKey);
};
export const getSignature = ({ signatureLevel = SignatureEnum.User }) => {
  let signature = { accessSignature: undefined, refreshSignature: undefined };
  switch (signatureLevel) {
    case SignatureEnum.Admin:
      accessSignature = ADMIN_ACCESS_TOKEN_SECRET_KEY;
      refreshSignature = ADMIN_REFRESH_TOKEN_SECRET_KEY;
      break;
    case SignatureEnum.User:
      accessSignature = ACCESS_TOKEN_SECRET_KEY;
      refreshSignature = REFRESH_TOKEN_SECRET_KEY;
      break;
    default:
      accessSignature = ACCESS_TOKEN_SECRET_KEY;
      refreshSignature = REFRESH_TOKEN_SECRET_KEY;
  }
  return signature;
};
