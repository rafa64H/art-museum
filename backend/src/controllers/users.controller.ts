import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { UserModel } from "../models/user.model";
import { AuthMiddlewareRequest } from "../middleware/verifyJWT";
import backendCheckValidityEmail from "../utils/form-input-validations/backendCheckValidityEmail";
import backendCheckValidityNameOrUsername from "../utils/form-input-validations/backendCheckValidityNameUsername";

export async function getAllUsersHandler(
  req: AuthMiddlewareRequest,
  res: Response
) {
  try {
    const users = await UserModel.find();
    const usersWithoutPassword = users.map((user) => {
      return { ...user.toObject(), password: undefined };
    });

    res.status(200).json({ success: true, users: usersWithoutPassword });
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }
}

export async function getUserHandler(req: Request, res: Response) {
  try {
    const userId = req.params.userId;

    const userIdObjectId = ObjectId.createFromHexString(userId);
    const foundUser = await UserModel.findOne(userIdObjectId);

    if (!foundUser)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    return res.status(200).json({
      success: true,
      user: { ...foundUser.toObject(), password: undefined },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }
}

export async function editUserHandler(
  req: AuthMiddlewareRequest,
  res: Response
) {
  try {
    if (!req.userId)
      return res.status(401).json({
        success: false,
        message: "Error editing account: Unauthorized",
      });

    const userIdObjectId = ObjectId.createFromHexString(req.userId);

    const foundUser = await UserModel.findOne(userIdObjectId);

    if (!foundUser)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    const { password, newEmail, newName, newUsername } = req.body as {
      password: string | null;
      newEmail: string | null;
      newName: string | null;
      newUsername: string | null;
    };

    if (!password)
      return res
        .status(401)
        .json({ success: false, message: "Wrong current password" });

    const validDialogPassword = await bcrypt.compare(
      password,
      foundUser.password
    );
    if (!validDialogPassword) {
      return res
        .status(401)
        .json({ success: false, message: "Wrong current password" });
    }

    if (newEmail && newEmail !== foundUser.email) {
      if (!backendCheckValidityEmail(newEmail))
        return res
          .status(400)
          .json({ success: false, message: "Invalid Email" });

      if (!(newEmail === foundUser.email) && !foundUser.changedEmail) {
        foundUser.previousEmail = foundUser.email;
        foundUser.email = newEmail!;
        foundUser.previousEmailVerified = foundUser.verified;
        foundUser.verified = false;
        foundUser.changedEmail = true;
      }
    }

    if (newName && newName !== foundUser.name) {
      if (!backendCheckValidityNameOrUsername(foundUser.name))
        return res
          .status(400)
          .json({ success: false, message: "Invalid Name" });

      foundUser.name = newName;
    }

    if (newUsername && newUsername !== foundUser.username) {
      if (!backendCheckValidityNameOrUsername(foundUser.username))
        return res
          .status(400)
          .json({ success: false, message: "Invalid Username" });

      foundUser.username = `@${newUsername}`;
    }

    console.log(newName, foundUser.name);
    console.log(newUsername, foundUser.username);

    await foundUser.save();

    res.status(200).json({
      success: true,
      user: { ...foundUser.toObject(), password: undefined },
      message: "User account edited",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }
}

export async function changePasswordHandler(
  req: AuthMiddlewareRequest,
  res: Response
) {
  if (!req.userId)
    return res.status(401).json({
      success: false,
      message: "Error editing account: Unauthorized",
    });

  const userIdObjectId = ObjectId.createFromHexString(req.userId);

  const foundUser = await UserModel.findOne(userIdObjectId);
  if (!foundUser)
    return res.status(404).json({ success: false, message: "User not found" });

  const { password, newPassword } = req.body as {
    password: string;
    newPassword: string;
  };

  let hashedPassword = null;

  if (newPassword) {
    const validDialogPassword = await bcrypt.compare(
      password,
      foundUser.password
    );

    if (!validDialogPassword) {
      return res
        .status(401)
        .json({ success: false, message: "Wrong current password" });
    }

    hashedPassword = await bcrypt.hash(newPassword, 10);
    foundUser.password = hashedPassword ? hashedPassword : foundUser.password;
    await foundUser.save();

    res.status(200).json({ success: true, message: "User password changed" });
  }
}

export async function getFollowersFollowingFromUser(
  req: AuthMiddlewareRequest,
  res: Response
) {
  try {
    const userIdMiddleware = req.userId;
    if (!userIdMiddleware)
      return res.status(401).json({
        success: true,
        message: "Unauthorized to get followers and following",
      });
    const userId = req.params.userId;
    const userIdObjectId = ObjectId.createFromHexString(userId);
    const foundUser = await UserModel.findOne(userIdObjectId);

    if (!foundUser)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    if (!((foundUser._id as string).toString() === userIdMiddleware))
      return res
        .status(400)
        .json({ success: false, message: "Not the same user" });

    const objectUser = foundUser.toObject();

    let following: {}[] = [];

    let followers: {}[] = [];

    for (let index = 0; index < objectUser.following.length; index++) {
      const idFromFollowingObjectId = ObjectId.createFromHexString(
        objectUser.following[index]
      );

      const userFromFollowing = await UserModel.findOne(
        idFromFollowingObjectId
      );

      if (!userFromFollowing) return null;

      const userFromFollowingObject = userFromFollowing.toObject();

      following.push({ ...userFromFollowingObject, password: undefined });
    }

    for (let index = 0; index < objectUser.followers.length; index++) {
      const idFromFollowersObjectId = ObjectId.createFromHexString(
        objectUser.followers[index]
      );

      const userFromFollowers = await UserModel.findOne(
        idFromFollowersObjectId
      );

      if (!userFromFollowers) return null;

      const userFromFollowersObject = userFromFollowers.toObject();

      followers.push({ ...userFromFollowersObject, password: undefined });
    }

    res
      .status(200)
      .json({ success: true, following: following, followers: followers });
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }
}
export async function addFollowerHandler(
  req: AuthMiddlewareRequest,
  res: Response
) {
  try {
    const userId = req.params.userId;
    const userIdRequest = req.userId as string;

    const userIdObjectId = ObjectId.createFromHexString(userId);
    const userIdObjectIdRequest = ObjectId.createFromHexString(userIdRequest);

    const foundUser = await UserModel.findOne(userIdObjectId);
    const userRequest = await UserModel.findOne(userIdObjectIdRequest);

    if (!foundUser)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    if (!userRequest)
      return res
        .status(404)
        .json({ success: false, message: "User doing request not found" });

    foundUser.followers = [...foundUser.followers, userIdRequest];
    userRequest.following = [...foundUser.following, userId];

    await foundUser.save();
    await userRequest.save();

    return res.status(200).json({
      success: true,
      message: `${userRequest.username} now following ${foundUser.username}`,
      userRequestFollowing: userRequest.following,
      foundUserFollowers: foundUser.followers,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }
}

export async function deleteFollowerHandler(
  req: AuthMiddlewareRequest,
  res: Response
) {
  try {
    const userId = req.params.userId;
    const userIdRequest = req.userId as string;

    const userIdObjectId = ObjectId.createFromHexString(userId);
    const userIdObjectIdRequest = ObjectId.createFromHexString(userIdRequest);

    const foundUser = await UserModel.findOne(userIdObjectId);
    const userRequest = await UserModel.findOne(userIdObjectIdRequest);

    if (!foundUser)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    if (!userRequest)
      return res
        .status(404)
        .json({ success: false, message: "User doing request not found" });

    const indexFollower = foundUser.followers.indexOf(userIdRequest);
    const indexFollowing = userRequest.following.indexOf(userId);

    if (indexFollower === -1 || indexFollowing === -1) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    foundUser.followers.splice(indexFollower, 1);
    userRequest.following.splice(indexFollowing, 1);
    await foundUser.save();
    await userRequest.save();

    return res.status(200).json({
      success: true,
      message: `${userRequest.username} unfollowed ${foundUser.username}`,
      userRequestFollowing: userRequest.following,
      foundUserFollowers: foundUser.followers,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }
}

export async function undoEmailChangeHandler(
  req: AuthMiddlewareRequest,
  res: Response
) {
  try {
    const userId = req.userId;
    console.log(userId);
    if (!userId)
      return res.status(401).json({ success: false, message: "Unauthorized" });
    const userIdObjectId = ObjectId.createFromHexString(userId);

    const foundUser = await UserModel.findOne(userIdObjectId);
    console.log(foundUser);
    if (!foundUser)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    if (!foundUser.previousEmail)
      return res.status(400).json({
        success: false,
        message: "User does not have a previous email",
      });

    foundUser.email = foundUser.previousEmail;
    foundUser.verified = foundUser.previousEmailVerified;
    foundUser.changedEmail = false;
    foundUser.previousEmail = null;
    await foundUser.save();

    return res
      .status(200)
      .json({ success: true, message: "Email change undid successfully" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal servver error" });
  }
}
