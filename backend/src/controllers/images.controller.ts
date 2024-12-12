import { ObjectId } from "mongodb";
import { bucket } from "../db/connectDB";
import { Request, Response } from "express";
import { UserModel } from "../models/user.model";
import { AuthMiddlewareRequest } from "../middleware/verifyJWT";
import { ProfilePictureModel } from "../models/profilePicture.model";
import { PostModel } from "../models/post.model";
import { ImageModel } from "../models/image.model";

export async function uploadProfilePictureHandler(
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

    const profilePictureId = foundUser.profilePictureId;
    if (profilePictureId) {
      const deletedPreviousProfilePicture =
        await ProfilePictureModel.findOneAndDelete(profilePictureId);
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
      const newProfilePictureId = newProfilePicture._id as ObjectId;
      foundUser.profilePictureId = newProfilePictureId;
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

export async function uploadImagesPostHandler(
  req: AuthMiddlewareRequest,
  res: Response
) {
  try {
    const userId = req.userId!;
    const files = req.files as Express.Multer.File[];
    if (!files)
      return res
        .status(400)
        .json({ success: false, message: "No file provided" });
    if ((files.length as number) <= 0)
      return res
        .status(400)
        .json({ success: false, message: "No file provided" });

    const userIdObjectId = ObjectId.createFromHexString(userId);
    const foundUser = await UserModel.findOne(userIdObjectId);
    if (!foundUser)
      return res.status(401).json({ success: false, message: "Unauhtorized" });

    const arrayOfImagesIdsAndURLs = await Promise.all(
      files.map(async (file) => {
        const fileName = `${Date.now()}-${file.originalname}`;
        const fileRef = `postsImages/${userId}/${fileName}`;
        const fileUpload = bucket.file(fileRef);

        const stream = fileUpload.createWriteStream({
          metadata: {
            contentType: file.mimetype,
          },
        });

        return new Promise((resolve, reject) => {
          stream.on("error", (error) => {
            reject(error);
          });

          stream.on("finish", async () => {
            try {
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

              resolve({
                imageId: newPostImage._id,
                imageURL: newPostImage.imageURL,
              });
            } catch (error) {
              reject(error);
            }
          });

          stream.end(file.buffer);
        });
      })
    );

    res.status(200).json({
      success: true,
      imageIdsAndUrls: arrayOfImagesIdsAndURLs,
      message: "Upload completed",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({ success: false, message: error });
  }
}
