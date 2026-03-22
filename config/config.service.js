import { config } from "dotenv";
import { resolve } from "node:path";
export const NODE_ENV = process.env.NODE_ENV;
const envPath = {
  development: ".env.development",
  production: ".env.production",
};
config({
  path: resolve(`./config/${envPath[NODE_ENV] || envPath.development}`),
});
export const PORT = process.env.PORT ?? 7000;
export const DATABASE_URI = process.env.DATABASE_URI;
export const SALT = process.env.SALT;
export const ENCRYPTION_SECRET_KEY = process.env.ENCRYPTION_SECRET_KEY;
//====user===================================
export const ACCESS_TOKEN_SECRET_KEY = process.env.ACCESS_TOKEN_SECRET;
export const REFRESH_TOKEN_SECRET_KEY = process.env.REFRESH_TOKEN_SECRET_KEY;
//=========admin================================
export const ADMIN_ACCESS_TOKEN_SECRET_KEY =
  process.env.ADMIN_ACCESS_TOKEN_SECRET;
export const ADMIN_REFRESH_TOKEN_SECRET_KEY =
  process.env.ADMIN_REFRESH_TOKEN_SECRET_KEY;

export const TOKEN_EXPIRES_IN = process.env.TOKEN_EXPIRES_IN;
export const REFRESH_EXPIRES_IN = process.env.REFRESH_EXPIRES_IN;
export const MAILTRAP_USER = process.env.MAILTRAP_USER;
export const MAILTRAP_PASS = process.env.MAILTRAP_PASS;
export const SMTP_PASSWORD_KEY = process.env.SMTP_PASSWORD_KEY;
export const SMTP_USER = process.env.SMTP_USER;
export const SMTP_PORT = process.env.SMTP_PORT;
export const CLOUD_NAME = process.env.CLOUD_NAME;
export const CLOUD_API_KEY = process.env.CLOUD_API_KEY;
export const CLOUD_API_SECRET = process.env.CLOUD_API_SECRET;
export const APP_NAME = process.env.APP_NAME;
