import { successResponse } from "../../Utils/index.js";
import * as service from "./user.services.js";
export const profile = async (req, res, next) => {
  try {
    let userId = req.user.id;
    const profile = await service.getProfile(userId);
    return successResponse({
      res,
      message: "profile fetched successfully!",
      data: { profile },
    });
  } catch (error) {
    next(error);
  }
};
export const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    if (req.body.password) {
      delete req.body.password;
    }
    console.log(req.body);
    const profile = await service.updateProfile(userId, req.body);
    return successResponse({
      res,
      status: 200,
      message: "Profile updated successfully!",
      data: { profile },
    });
  } catch (error) {
    next(error);
  }
};

export const updatePassword = async (req, res, next) => {
  try {
    const userId = req.user.id;
    let { currentPassword, newPassword } = req.body;
    const updatedPassword = await service.changePassword(
      userId,
      currentPassword,
      newPassword,
    );
    return successResponse({
      res,
      status: 200,
      message: "Password changed successfully!",
    });
  } catch (error) {
    next(error);
  }
};
export const deleteProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const result = await service.deleteProfile(userId);
    return successResponse({
      res,
      status: 200,
      message: "Profile deleted successfully!",
      data: { result },
    });
  } catch (error) {
    next(error);
  }
};

export const profilePic = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const updatedUser = await service.uploadProfilePic(userId, req.file);
    successResponse({
      res,
      status: 200,
      message: "Profile picture uploaded successfully!",
      data: {
        updatedUser,
      },
    });
  } catch (error) {
    next(error);
  }
};
