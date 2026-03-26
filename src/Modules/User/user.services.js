import fs, { existsSync, unlinkSync } from "node:fs";
import { userRepo } from "../../DB/Repo/index.js";
import {
  BadRequestException,
  compare,
  ConflictException,
  decrypt,
  hash,
  InvalidCredentialsException,
  NotFoundException,
  UnauthorizedException,
} from "../../Utils/index.js";
import { checkExistence } from "../Auth/auth.services.js";
import path, { resolve } from "node:path";
import mongoose from "mongoose";
import { RoleEnum } from "../../Utils/Enums/user.enums.js";

export const getUserWithNoSensitiveData = (user) => {
  const userObj = user.toObject();

  delete userObj.password;
  delete userObj.otp;
  delete userObj.__v;
  delete userObj.role;
  delete userObj.privateKey;
  delete userObj.publicKey;
  delete userObj.profileVisits;
  delete userObj.provider;
  delete userObj.isConfirmed;

  return userObj;
};
export const getMyProfile = async (userId) => {
  const user = await userRepo.findById({
    id: userId,
    projection: { username: 1, email: 1, password: 1, profilePicture: 1 },
  });
  if (!user) {
    NotFoundException({ message: "User Not Found!" });
  }

  if (user._id.toString() !== userId.toString()) {
    UnauthorizedException({ message: "You are not authorized" });
  }
  return user;
};

export const updateProfile = async (user, data) => {
  if (data.email) {
    const alreadyExist = await checkExistence(data.email);
    if (alreadyExist) {
      ConflictException({
        message: "Email already in use,use different email!",
      });
    }
  }
  const updatedUser = await userRepo.findByIdAndUpdate({
    id: user._id,
    update: data,
  });

  return updatedUser;
};

export const changePassword = async (user, currentPassword, newPassword) => {
  const checkPassword = await compare(currentPassword, user.password);
  if (!checkPassword) {
    InvalidCredentialsException({
      message: "Incorrect current password!",
    });
  }
  newPassword = await hash(newPassword);
  const result = await userRepo.updateOne({
    filter: { _id: user._id },
    update: { password: newPassword },
  });

  return result;
};
export const deleteProfile = async (userId) => {
  const user = await userRepo.findByIdAndDelete(userId);
  if (!user && user._id.toString() !== userId.toString()) {
    return UnauthorizedException({ message: "You are not authorized" });
  }
  return true;
};
export const uploadProfilePic = async (user, file) => {
  if (user.profilePicture) {
    const old = resolve(user.profilePicture);

    if (fs.existsSync(old)) {
      //file name
      const fileName = path.basename(old);

      const galleryFolder = resolve(`upload/${user._id}/gallery`);

      // checks if gallery folder is exist
      if (!fs.existsSync(galleryFolder)) {
        fs.mkdirSync(galleryFolder, { recursive: true });
      }

      // new path for the old images files
      const newPath = resolve(`upload/${user._id}/gallery/${fileName}`);

      // move old photo into the new folder
      fs.renameSync(old, newPath);
    }
  }

  user.profilePicture = file.finalPath;
  await user.save();

  return user;
};
export const removeProfilePic = async (user) => {
  if (!user.profilePicture) {
    BadRequestException({ message: "No photo found to delete" });
  }

  user.profilePicture = undefined;
  await user.save();
  return true;
};
export const uploadCoverPhotos = async (user, file) => {
  //check images count , if already 2 replace new one with the oldest one
  if (user.coverPhotos.length >= 2) {
    user.coverPhotos.shift();
  }
  user.coverPhotos.push(file.finalPath);
  user.save();
  return file;
};
export const getUserProfile = async (userId) => {
  let safeUser;
  const user = await userRepo.findById({
    id: userId,
    // projection: "-password -otp -__v -publicKey -privateKey",
  });
  console.log(user);
  if (!user) {
    NotFoundException({
      message: "User Not found!",
    });
  }
  if (user?._id.toString() !== userId.toString()) user.profileVisits += 1;
  await user.save();

  return (safeUser = getUserWithNoSensitiveData(user));
};
export const visitCount = async (userId) => {
  const user = await userRepo.findById({
    id: userId,
    projection: { profileVisits: 1 },
  });
  if (!user) {
    NotFoundException({ message: "User not found" });
  }

  return user;
};
