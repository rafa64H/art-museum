import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { UserModel } from "../models/user.model";
import { AuthMiddlewareRequest } from "../middleware/verifyJWT";

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

    console.log(foundUser._id, userIdObjectId);

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
