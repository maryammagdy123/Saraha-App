import fs from "node:fs";
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
  if (!user && user._id.toString() !== userId) {
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

export const uploadCoverPhotos = async (user, file) => {
  //check images count , if already 2 replace new one with the oldest one
  if (user.coverPhotos.length >= 2) {
    user.coverPhotos.shift();
  }
  user.coverPhotos.push(file.finalPath);
  user.save();
  return file;
};
