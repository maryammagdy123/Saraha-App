import fs from "node:fs";
import { userRepo } from "../../DB/Repo/index.js";
import {
  compare,
  ConflictException,
  decrypt,
  hash,
  InvalidCredentialsException,
  NotFoundException,
  UnauthorizedException,
} from "../../Utils/index.js";
import { checkExistence } from "../Auth/auth.services.js";

export const getProfile = async (userId) => {
  const user = await userRepo.findById({
    id: userId,
    projection: { username: 1, email: 1, password: 1 },
  });
  if (!user) {
    NotFoundException({ message: "User Not Found!" });
  }

  if (user._id.toString() !== userId) {
    UnauthorizedException({ message: "You are not authorized" });
  }
  return user;
};

export const updateProfile = async (userId, data) => {
  if (data.email) {
    const alreadyExist = await checkExistence(data.email);
    if (alreadyExist) {
      ConflictException({
        message: "Email already in use,use different email!",
      });
    }
  }

  const updatedUser = await userRepo.findByIdAndUpdate({
    id: userId,
    update: data,
  });

  return updatedUser;
};

export const changePassword = async (userId, currentPassword, newPassword) => {
  const user = await userRepo.findById({ id: userId });
  const checkPassword = await compare(currentPassword, user.password);
  if (!checkPassword) {
    InvalidCredentialsException({
      message: "Please enter correct current password!",
    });
  }
  newPassword = await hash(newPassword);
  const result = await userRepo.updateOne({
    filter: { _id: userId },
    update: { password: newPassword },
  });

  return result.password;
};
export const deleteProfile = async (userId) => {
  const user = await userRepo.findByIdAndDelete(userId);
  if (!user && user._id.toString() !== userId) {
    return UnauthorizedException({ message: "You are not authorized" });
  }
  return true;
};
export const uploadProfilePic = async (userId, file) => {
  const existUser = await userRepo.findById({ id: userId });
  //delete old uploaded profile picture , only the last one remains
  fs.unlinkSync(existUser.profilePicture);
  const user = await userRepo.updateOne({
    filter: { _id: userId },
    update: { profilePicture: file.path },
  });
  if (!user) {
    NotFoundException({ message: "User not found!" });
  }

  return user;
};
