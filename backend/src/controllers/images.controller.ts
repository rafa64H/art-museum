import { ObjectId } from "mongodb";
import ErrorReturn from "../constants/ErrorReturn";
import { bucket } from "../db/connectDB";
import { Request, Response } from "express";
import { UserModel } from "../models/user.model";
import { ImageModel } from "../models/image.model";
import { AuthMiddlewareRequest } from "../middleware/verifyJWT";

export async function uploadImageHandler(
  req: AuthMiddlewareRequest,
  res: Response
) {
  try {
    const userId = req.userId!;
    const file = req.file;
    if (!file) {
      throw new ErrorReturn(400, "no file provided");
    }
    const userIdObjectId = ObjectId.createFromHexString(userId);
    const foundUser = await UserModel.findOne(userIdObjectId);

    if (!foundUser) {
      throw new ErrorReturn(401, "Unauthorized");
    }

    const fileName = file.originalname;
    const fileRef = `usersProfilePictures/${userId}/${fileName}`;
    const fileUpload = bucket.file(fileRef);

    const stream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });

    stream.on("error", async (error) => {
      console.error("Error uploading file");

      throw new ErrorReturn(500, "Error uploading file");
    });

    stream.on("finish", async () => {
      const downloadURL = await fileUpload.getSignedUrl({
        action: "read",
        expires: "10-12-5000",
      });

      const newImage = new ImageModel({
        uploaderId: userIdObjectId,
        filename: fileName,
        imageURL: downloadURL[0],
        fileRefFirebaseStorage: fileRef,
      });

      await newImage.save();

      res.status(200).json({ success: true, message: "Upload completed" });
    });

    stream.end(file.buffer);
  } catch (error) {
    const isErrorReturn = error instanceof ErrorReturn;
    console.log(error);

    res.status(isErrorReturn ? error.status : 500).json({
      success: false,
      message: isErrorReturn ? error.message : error,
    });
  }
}
