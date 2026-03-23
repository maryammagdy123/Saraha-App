import { successResponse } from "../../Utils/index.js";
import * as service from "./user.services.js";
export const profile = async (req, res, next) => {
  try {
    let userId = req.user._id;
    const profile = await service.getMyProfile(userId);
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
    const user = req.user;
    if (req.body.password) {
      delete req.body.password;
    }
    console.log(req.body);
    const profile = await service.updateProfile(user, req.body);
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
    const user = req.user;
    let { currentPassword, newPassword } = req.body;
    const result = await service.changePassword(
      user,
      currentPassword,
      newPassword,
    );
    return successResponse({
      res,
      status: 200,
      message: "Password changed successfully!",
      data: {
        success: true,
        result,
      },
    });
  } catch (error) {
    next(error);
  }
};
export const deleteProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;
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

export const deleteProfilePicture = async (req, res, next) => {
  try {
    const user = req.user;
    const result = await service.removeProfilePic(user);
    return successResponse({
      res,
      status: 200,
      message: "Profile Picture removed successfully!",
      data: { result },
    });
  } catch (error) {
    next(error);
  }
};
export const profilePic = async (req, res, next) => {
  try {
    const updatedUser = await service.uploadProfilePic(req.user, req.file);
    return successResponse({
      res,
      status: 200,
      message: "Profile picture uploaded successfully!",
      data: {
        success: true,
        "profile-pic": updatedUser.profilePicture,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const coverPhoto = async (req, res, next) => {
  try {
    const uploadedCover = await service.uploadCoverPhotos(req.user, req.file);
    return successResponse({
      res,
      status: 200,
      message: "Cover picture uploaded successfully!",
      data: {
        success: true,
        cover: uploadedCover,
      },
    });
  } catch (error) {
    next(error);
  }
};
export const visitUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const visitedUser = await service.getUserProfile(userId);
    return successResponse({
      res,
      status: 200,
      message: "done",
      data: {
        visitedUser,
      },
    });
  } catch (error) {
    next(error);
  }
};
export const getVisitCount = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const result = await service.visitCount(userId);
     return successResponse({
      res,
      status: 200,
      message: "done",
      data: {
       result,
      },
    });
  } catch (error) {
    next(error);
  }
};
