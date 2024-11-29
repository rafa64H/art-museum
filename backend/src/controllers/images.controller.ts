import { ObjectId } from "mongodb";
import { bucket } from "../db/connectDB";
import { Request, Response } from "express";
import { UserModel } from "../models/user.model";
import { AuthMiddlewareRequest } from "../middleware/verifyJWT";
import { ProfilePictureModel } from "../models/profilePicture.model";
import { PostModel } from "../models/post.model";
import { ImageModel } from "../models/image.model";

export async function uploadImageHandler(
  req: AuthMiddlewareRequest,
  res: Response
) {
  try {
    const userId = req.userId!;
    const file = req.file;
    if (!file) {
      return res
        .status(400)
        .json({ success: false, message: "No file provided" });
    }
    const userIdObjectId = ObjectId.createFromHexString(userId);
    const foundUser = await UserModel.findOne(userIdObjectId);

    if (!foundUser) {
      return res.status(401).json({ success: false, message: "Unauhtorized" });
    }

    const fileName = userId;
    const fileRef = `usersProfilePictures/${userId}/${fileName}`;
    const fileUpload = bucket.file(fileRef);

    const stream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });

    stream.on("error", async (error) => {
      return res
        .status(500)
        .json({ success: false, message: "Error uploading file" });
    });

    stream.on("finish", async () => {
      const downloadURL = await fileUpload.getSignedUrl({
        action: "read",
        expires: "10-12-5000",
      });

      const newProfilePicture = new ProfilePictureModel({
        uploaderId: userIdObjectId,
        filename: fileName,
        imageURL: downloadURL[0],
        fileRefFirebaseStorage: fileRef,
      });

      await newProfilePicture.save();

      foundUser.profilePictureURL = downloadURL[0];
      await foundUser.save();

      res.status(200).json({
        success: true,
        user: { ...foundUser.toObject(), password: undefined },
        message: "Upload completed",
      });
    });

    stream.end(file.buffer);
  } catch (error) {
    console.log(error);

    res.status(500).json({ success: false, message: error });
  }
}

export async function uploadImagePostHandler(
  req: AuthMiddlewareRequest,
  res: Response
) {
  try {
    const userId = req.userId!;
    const file = req.file;
    if (!file) {
      return res
        .status(400)
        .json({ success: false, message: "No file provided" });
    }
    const userIdObjectId = ObjectId.createFromHexString(userId);
    const foundUser = await UserModel.findOne(userIdObjectId);

    if (!foundUser) {
      return res.status(401).json({ success: false, message: "Unauhtorized" });
    }

    const fileName = file.originalname;
    const fileRef = `postsImages/${userId}/${fileName}`;
    const fileUpload = bucket.file(fileRef);

    const stream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });

    stream.on("error", async (error) => {
      return res
        .status(500)
        .json({ success: false, message: "Error uploading file" });
    });

    stream.on("finish", async () => {
      const downloadURL = await fileUpload.getSignedUrl({
        action: "read",
        expires: "10-12-5000",
      });

      const newPostImage = new ImageModel({
        uploaderId: userIdObjectId,
        filename: fileName,
        imageURL: downloadURL[0],
        fileRefFirebaseStorage: fileRef,
      });

      await newPostImage.save();

      res.status(200).json({
        success: true,
        image: newPostImage.toObject(),
        message: "Upload completed",
      });
    });

    stream.end(file.buffer);
  } catch (error) {
    console.log(error);

    res.status(500).json({ success: false, message: error });
  }
}
