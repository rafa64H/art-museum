import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { UserDocument, UserModel } from "../models/user.model";
import { AuthMiddlewareRequest } from "../middleware/verifyJWT";
import CustomError from "../constants/customError";
import { validateUsersRoutesRequest } from "../utils/validation/joi/validateUsersRoutesRequestJoi";
import databaseValidateUserIdObjectId from "../utils/validation/database/databaseValidateUserIdObjectId";
import databaseValidateEditAccountInfo from "../utils/validation/database/users-routes/databaseValidateEditAccountInfo";
import checkOrChangeIfUsernameHasAt from "../utils/checkOrChangeIfUsernameHasAt";

export async function getAllUsersHandler(
  req: AuthMiddlewareRequest,
  res: Response,
) {
  const users = await UserModel.find();
  const usersWithoutPassword = users.map((user) => {
    return { ...user.toObject(), password: undefined };
  });

  res.status(200).json({ success: true, users: usersWithoutPassword });
}

export async function getUserHandler(req: Request, res: Response) {
  const userId = req.params.userId;
  validateUsersRoutesRequest({ userId });
  const validatedUserId = userId as string;

  const userIdObjectId = ObjectId.createFromHexString(validatedUserId);
  const foundUser = (await databaseValidateUserIdObjectId(
    userIdObjectId,
    true,
  )) as UserDocument;

  res.status(200).json({
    success: true,
    user: { ...foundUser.toObject(), password: undefined },
  });
}

export async function editUserHandler(
  req: AuthMiddlewareRequest,
  res: Response,
) {
  const userId = req.userId;
  const { password, newEmail, newName, newUsername } = req.body as {
    password: unknown;
    newEmail: unknown;
    newName: unknown;
    newUsername: unknown;
  };

  validateUsersRoutesRequest({
    userId,
    loginPassword: password,
    email: newEmail,
    name: newName,
    username: newUsername,
    passedUserId: true,
    passedLoginPassword: true,
    passedEmail: true,
    passedName: true,
    passedUsername: true,
  });

  const validatedUserId = userId as string;
  const validatedPassword = password as string;
  const validatedNewEmail = newEmail as string;
  const validatedNewName = newName as string;
  const validatedNewUsername = newUsername as string;

  const userIdObjectId = ObjectId.createFromHexString(validatedUserId);

  const foundUser = (await databaseValidateUserIdObjectId(
    userIdObjectId,
    true,
  )) as UserDocument;

  const validDialogPassword = await bcrypt.compare(
    validatedPassword,
    foundUser.password,
  );
  if (!validDialogPassword) {
    throw new CustomError(401, "Wrong password");
  }

  const newUsernameWithAt = checkOrChangeIfUsernameHasAt(validatedNewUsername);

  await databaseValidateEditAccountInfo({
    userDocument: foundUser,
    password: validatedPassword,
    newEmail: validatedNewEmail,
    newName: validatedNewName,
    newUsernameWithAt,
  });

  const editedUser = (await databaseValidateUserIdObjectId(
    userIdObjectId,
    true,
  )) as UserDocument;

  res.status(200).json({
    success: true,
    user: { ...editedUser.toObject(), password: undefined },
    message: "User account edited",
  });
}

export async function changePasswordHandler(
  req: AuthMiddlewareRequest,
  res: Response,
) {
  const userId = req.userId;
  const { password, newPassword, confirmNewPassword } = req.body as {
    password: unknown;
    newPassword: unknown;
    confirmNewPassword: unknown;
  };

  validateUsersRoutesRequest({
    userId,
    password: newPassword,
    confirmPassword: confirmNewPassword,
    loginPassword: password,
    passedUserId: true,
    passedPassword: true,
    passedConfirmPassword: true,
    passedLoginPassword: true,
  });

  const validatedUserId = userId as string;
  const validatedPassword = password as string;
  const validatedConfirmNewPassword = confirmNewPassword as string;
  const validatedNewPassword = newPassword as string;

  const userIdObjectId = ObjectId.createFromHexString(validatedUserId);

  const foundUser = (await databaseValidateUserIdObjectId(
    userIdObjectId,
    true,
  )) as UserDocument;

  const validVerifyPassword = await bcrypt.compare(
    validatedPassword,
    foundUser.password,
  );

  if (!validVerifyPassword) throw new CustomError(401, "Wrong password");

  const newHashedPassword = await bcrypt.hash(validatedNewPassword, 10);
  await foundUser.updateOne({ $set: { password: newHashedPassword } });

  res.status(200).json({ success: true, message: "User password changed" });
}

export async function getFollowersFromUser(
  req: AuthMiddlewareRequest,
  res: Response,
) {
  const userIdMiddleware = req.userId as unknown;
  const userId = req.params.userId;

  validateUsersRoutesRequest({ userId: userId });
  validateUsersRoutesRequest({ userId: userIdMiddleware });

  const validatedUserId = userId as string;
  const validatedUserIdMiddleware = userIdMiddleware as string;

  const userIdObjectId = ObjectId.createFromHexString(validatedUserId);
  const userIdMiddlewareObjectId = ObjectId.createFromHexString(
    validatedUserIdMiddleware,
  );
  const foundUser = (await databaseValidateUserIdObjectId(
    userIdObjectId,
    true,
  )) as UserDocument;

  if (validatedUserId !== validatedUserIdMiddleware)
    throw new CustomError(
      401,
      `Not the same authenticated user as the user in param ${validatedUserId}... ${validatedUserIdMiddleware}`,
    );

  const objectUser = await foundUser.toObject();

  let followers: {}[] = [];

  for (let index = 0; index < objectUser.followers.length; index++) {
    const idFromFollowersObjectId = ObjectId.createFromHexString(
      objectUser.followers[index],
    );

    const userFromFollowers = (await UserModel.findOne(
      idFromFollowersObjectId,
    )) as UserDocument | undefined | null;

    if (!userFromFollowers) return null;

    const userFromFollowersObject = {
      _id: userFromFollowers._id,
      name: userFromFollowers.name,
      username: userFromFollowers.username,
      email: userFromFollowers.email,
      profilePictureURL: userFromFollowers.profilePictureURL,
    };

    followers.push({ ...userFromFollowersObject, password: undefined });
  }

  res.status(200).json({ success: true, followers });
}

export async function getFollowingFromUser(
  req: AuthMiddlewareRequest,
  res: Response,
) {
  const userIdMiddleware = req.userId as unknown;
  const userId = req.params.userId;

  validateUsersRoutesRequest({ userId: userId });
  validateUsersRoutesRequest({ userId: userIdMiddleware });

  const validatedUserId = userId as string;
  const validatedUserIdMiddleware = userIdMiddleware as string;

  const userIdObjectId = ObjectId.createFromHexString(validatedUserId);
  const userIdMiddlewareObjectId = ObjectId.createFromHexString(
    validatedUserIdMiddleware,
  );
  const foundUser = (await databaseValidateUserIdObjectId(
    userIdObjectId,
    true,
  )) as UserDocument;

  if (validatedUserId !== validatedUserIdMiddleware)
    throw new CustomError(
      401,
      "Not the same authenticated user as the user in param",
    );

  const objectUser = foundUser.toObject();

  let following: {}[] = [];

  for (let index = 0; index < objectUser.following.length; index++) {
    const idFromFollowingObjectId = ObjectId.createFromHexString(
      objectUser.following[index],
    );

    const userFromFollowing = (await UserModel.findOne(
      idFromFollowingObjectId,
    )) as UserDocument | undefined | null;

    if (!userFromFollowing) return null;

    const userFromFollowingObject = {
      _id: userFromFollowing._id,
      name: userFromFollowing.name,
      username: userFromFollowing.username,
      email: userFromFollowing.email,
      profilePictureURL: userFromFollowing.profilePictureURL,
    };

    following.push({ ...userFromFollowingObject, password: undefined });
  }

  res.status(200).json({ success: true, following });
}

export async function addFollower(req: AuthMiddlewareRequest, res: Response) {
  const userId = req.params.userId as unknown;
  const userIdFollower = req.body.userIdFollower as unknown;
  const userIdFromMiddleware = req.userId as unknown;
  validateUsersRoutesRequest({ userId });
  validateUsersRoutesRequest({ userId: userIdFromMiddleware });
  validateUsersRoutesRequest({ userId: userIdFollower });

  const validatedUserId = userId as string;
  const validatedUserIdFromMiddleWare = userIdFromMiddleware as string;
  const validatedUserIdFollower = userIdFollower as string;

  const userIdObjectId = ObjectId.createFromHexString(validatedUserId);
  const userIdObjectIdRequest = ObjectId.createFromHexString(
    validatedUserIdFromMiddleWare,
  );
  const userIdObjectIdFollower = ObjectId.createFromHexString(
    validatedUserIdFollower,
  );

  const userDocument = (await databaseValidateUserIdObjectId(
    userIdObjectId,
    true,
  )) as UserDocument;
  const userDocumentFromMiddleware = (await databaseValidateUserIdObjectId(
    userIdObjectIdRequest,
    true,
  )) as UserDocument;

  const userFollowerDocument = (await databaseValidateUserIdObjectId(
    userIdObjectId,
    true,
  )) as UserDocument;

  const userAlreadyIsBeingFollowedByOtherUser = userDocument.followers.includes(
    validatedUserIdFollower,
  );

  if (userAlreadyIsBeingFollowedByOtherUser) {
    return res.status(200).json({
      success: true,
      message: `User ${userFollowerDocument.name} is already a follower of ${userDocument}`,
    });
  }

  await userDocument.updateOne({
    $push: { followers: validatedUserIdFollower },
  });
  await userFollowerDocument.updateOne({
    $push: { following: validatedUserId },
  });

  res.status(200).json({
    success: true,
    message: `${userDocument.username} is now being followed by ${userDocumentFromMiddleware.username}`,
  });
}

export async function removeFollower(
  req: AuthMiddlewareRequest,
  res: Response,
) {
  const userId = req.params.userId as unknown;
  const userIdFollower = req.params.userIdFollower as unknown;
  const userIdFromMiddleware = req.userId as unknown;
  validateUsersRoutesRequest({ userId });
  validateUsersRoutesRequest({ userId: userIdFromMiddleware });
  validateUsersRoutesRequest({ userId: userIdFollower });

  const validatedUserId = userId as string;
  const validatedUserIdFromMiddleWare = userIdFromMiddleware as string;
  const validatedUserIdFollower = userIdFollower as string;

  const userIdObjectId = ObjectId.createFromHexString(validatedUserId);
  const userIdObjectIdRequest = ObjectId.createFromHexString(
    validatedUserIdFromMiddleWare,
  );
  const userIdObjectIdFollower = ObjectId.createFromHexString(
    validatedUserIdFollower,
  );

  const userDocument = (await databaseValidateUserIdObjectId(
    userIdObjectId,
    true,
  )) as UserDocument;
  const userDocumentFromMiddleware = (await databaseValidateUserIdObjectId(
    userIdObjectIdRequest,
    true,
  )) as UserDocument;

  const userFollowerDocument = (await databaseValidateUserIdObjectId(
    userIdObjectId,
    true,
  )) as UserDocument;

  const userAlreadyIsBeingFollowedByOtherUser = userDocument.followers.includes(
    validatedUserIdFollower,
  );

  if (userAlreadyIsBeingFollowedByOtherUser) {
    await userDocument.updateOne({
      $pull: { followers: validatedUserIdFollower },
    });
    await userFollowerDocument.updateOne({
      $pull: { following: validatedUserId },
    });

    return res.status(200).json({
      success: true,
      message: `User ${userFollowerDocument.name} unfollowed ${userDocument}`,
    });
  }

  res.status(404).json({
    success: true,
    message: `User ${userDocument.username} is not being followed by ${userFollowerDocument.username}`,
  });
}

export async function addFollowing(req: AuthMiddlewareRequest, res: Response) {
  const userId = req.params.userId as unknown;
  const userIdFollowing = req.body.userIdFollowing as unknown;
  const userIdFromMiddleware = req.userId as unknown;
  validateUsersRoutesRequest({ userId });
  validateUsersRoutesRequest({ userId: userIdFromMiddleware });
  validateUsersRoutesRequest({ userId: userIdFollowing });

  const validatedUserId = userId as string;
  const validatedUserIdFromMiddleWare = userIdFromMiddleware as string;
  const validatedUserIdFollowing = userIdFollowing as string;

  const userIdObjectId = ObjectId.createFromHexString(validatedUserId);
  const userIdObjectIdRequest = ObjectId.createFromHexString(
    validatedUserIdFromMiddleWare,
  );
  const userIdObjectIdFollowing = ObjectId.createFromHexString(
    validatedUserIdFollowing,
  );

  const userDocument = (await databaseValidateUserIdObjectId(
    userIdObjectId,
    true,
  )) as UserDocument;
  const userDocumentFromMiddleware = (await databaseValidateUserIdObjectId(
    userIdObjectIdRequest,
    true,
  )) as UserDocument;

  const userFollowingDocument = (await databaseValidateUserIdObjectId(
    userIdObjectIdFollowing,
    true,
  )) as UserDocument;

  const userAlreadyIsBeingFollowedByOtherUser = userDocument.following.includes(
    validatedUserIdFollowing,
  );

  if (userAlreadyIsBeingFollowedByOtherUser) {
    return res.status(200).json({
      success: true,
      message: `User ${userFollowingDocument.name} is already a follower of ${userDocument}`,
    });
  }

  await userDocument.updateOne({
    $push: { following: validatedUserIdFollowing },
  });
  await userFollowingDocument.updateOne({
    $push: { following: validatedUserId },
  });

  res.status(200).json({
    success: true,
    message: `${userDocument.username} is now being followed by ${userDocumentFromMiddleware.username}`,
  });
}

export async function removeFollowing(
  req: AuthMiddlewareRequest,
  res: Response,
) {
  const userId = req.params.userId as unknown;
  const userIdFollowing = req.params.userIdFollowing as unknown;
  const userIdFromMiddleware = req.userId as unknown;
  validateUsersRoutesRequest({ userId });
  validateUsersRoutesRequest({ userId: userIdFromMiddleware });
  validateUsersRoutesRequest({ userId: userIdFollowing });

  const validatedUserId = userId as string;
  const validatedUserIdFromMiddleWare = userIdFromMiddleware as string;
  const validatedUserIdFollowing = userIdFollowing as string;

  const userIdObjectId = ObjectId.createFromHexString(validatedUserId);
  const userIdObjectIdRequest = ObjectId.createFromHexString(
    validatedUserIdFromMiddleWare,
  );
  const userIdObjectIdFollowing = ObjectId.createFromHexString(
    validatedUserIdFollowing,
  );

  const userDocument = (await databaseValidateUserIdObjectId(
    userIdObjectId,
    true,
  )) as UserDocument;
  const userDocumentFromMiddleware = (await databaseValidateUserIdObjectId(
    userIdObjectIdRequest,
    true,
  )) as UserDocument;

  const userFollowingDocument = (await databaseValidateUserIdObjectId(
    userIdObjectIdFollowing,
    true,
  )) as UserDocument;

  const userAlreadyIsBeingFollowedByOtherUser = userDocument.following.includes(
    validatedUserIdFollowing,
  );

  if (userAlreadyIsBeingFollowedByOtherUser) {
    await userDocument.updateOne({
      $pull: { following: validatedUserIdFollowing },
    });
    await userFollowingDocument.updateOne({
      $pull: { following: validatedUserId },
    });

    return res.status(200).json({
      success: true,
      message: `User ${userFollowingDocument.name} unfollowed ${userDocument}`,
    });
  }

  res.status(404).json({
    success: true,
    message: `User ${userDocument.username} is not being followed by ${userFollowingDocument.username}`,
  });
}
