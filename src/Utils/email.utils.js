import nodemailer from "nodemailer";
import { MAILTRAP_PASS, MAILTRAP_USER } from "../../config/config.service.js";

export const sendOTPEmail = async (email, otp,subject) => {
  //mailtrap
  const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 587,
    secure: false,
    auth: {
      user: MAILTRAP_USER,
      pass: MAILTRAP_PASS,
    },
  });

  const mailOptions = {
    from: '"Saraha App" <no-reply@saraha.com>',
    to: email,
    subject: subject,
    text: `Your OTP code is: ${otp}`,
  };

  await transporter.sendMail(mailOptions);
};
