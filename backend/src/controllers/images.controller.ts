import { ObjectId } from "mongodb";
import { bucket } from "../db/connectDB";
import { Request, Response } from "express";
import { UserDocument, UserModel } from "../models/user.model";
import { AuthMiddlewareRequest } from "../middleware/verifyJWT";
import { ProfilePictureModel } from "../models/profilePicture.model";
import { PostDocument, PostModel } from "../models/post.model";
import { ImageDocument, ImageModel } from "../models/image.model";
import CustomError from "../constants/customError";
import { validateImagesRoutesRequest } from "../utils/validation/joi/validateImagesRoutesRequestJoi";
import databaseValidateUserIdObjectId from "../utils/validation/database/databaseValidateUserIdObjectId";
import databaseValidateImageIdObjectId from "../utils/validation/database/images-routes/databaseValidateImageIdObjectId";
import databaseValidatePostIdObjectId from "../utils/validation/database/posts-routes/databaseValidatePostIdObjectId";

export async function uploadProfilePictureHandler(
  req: AuthMiddlewareRequest,
  res: Response
) {
  const userId = req.userId;
  const file = req.file;
  if (!file) {
    throw new CustomError(400, "No file provided");
  }

  validateImagesRoutesRequest({ userId });
  const validatedUserId = userId as string;

  const userIdObjectId = ObjectId.createFromHexString(validatedUserId);

  const userDocument = (await databaseValidateUserIdObjectId(
    userIdObjectId,
    true
  )) as UserDocument;

  const profilePictureId = userDocument.profilePictureId;
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
    throw new CustomError(500, "Error uploading file");
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

    await userDocument.updateOne({
      $set: {
        profilePictureURL: downloadURL[0],
        profilePictureId: newProfilePicture._id,
      },
    });

    res.status(200).json({
      success: true,
      user: { ...userDocument.toObject(), password: undefined },
      message: "Upload completed",
    });
  });

  stream.end(file.buffer);
}

export async function uploadImagesPostHandler(
  req: AuthMiddlewareRequest,
  res: Response
) {
  const userId = req.userId;
  const files = req.files as Express.Multer.File[];
  const postId = req.body.postId;
  if (!files) throw new CustomError(400, "No file provided");

  validateImagesRoutesRequest({ userId, postId });
  const validatedUserId = userId as string;
  const validatedPostId = postId as string;

  const postIdObjectId = ObjectId.createFromHexString(validatedPostId);
  const postOfTheImages = (await databaseValidatePostIdObjectId(
    postIdObjectId,
    true
  )) as PostDocument;

  const userIdObjectId = ObjectId.createFromHexString(validatedUserId);
  await databaseValidateUserIdObjectId(userIdObjectId, false);

  const arrayOfImagesIdsAndURLs = await Promise.all(
    files.map(async (file, index) => {
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
          throw new CustomError(500, "Error uploading file");
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
              postId: postIdObjectId,
              fileRefFirebaseStorage: fileRef,
            });

            await newPostImage.save();

            resolve({
              imageId: newPostImage._id,
              imageURL: newPostImage.imageURL,
            });
          } catch (error) {
            throw new CustomError(400, "No file provided");
          }
        });

        stream.end(file.buffer);
      });
    })
  );

  postOfTheImages.amountOfImages = files.map((_, index) => index + 1);
  await postOfTheImages.save();

  res.status(200).json({
    success: true,
    imageIdsAndUrls: arrayOfImagesIdsAndURLs,
    message: "Upload completed",
  });
}
export async function getPostImagesHandler(req: Request, res: Response) {
  const postId = req.params.postId;
  console.log(postId);
  if (!postId) throw new CustomError(400, "No postId provided");

  const postIdObjectId = ObjectId.createFromHexString(postId);
  const postOfTheImages = await PostModel.findOne(postIdObjectId);
  if (!postOfTheImages)
    throw new CustomError(400, "No post found with such id");

  const postImages = await ImageModel.find({ postId: postIdObjectId });

  const imagesIdsAndImagesURLs = postImages.map((imageDocument) => {
    return {
      imageId: imageDocument._id,
      imageURL: imageDocument.imageURL,
    };
  });

  return res.status(200).json({ success: true, imagesIdsAndImagesURLs });
}

export async function deletePostImagesHandler(
  req: AuthMiddlewareRequest,
  res: Response
) {
  const userId = req.userId;
  const postId = req.params.postId;
  const imagesIds = req.query.imageId;

  validateImagesRoutesRequest({ userId, postId, imagesIds });

  const validatedUserId = userId as string;
  const validatedPostId = postId as string;
  const validatedImagesIds = imagesIds as string[];

  const userIdObjectId = ObjectId.createFromHexString(validatedUserId);
  const postIdObjectId = ObjectId.createFromHexString(validatedPostId);

  await databaseValidateUserIdObjectId(userIdObjectId, false);
  await databaseValidatePostIdObjectId(postIdObjectId, false);

  validatedImagesIds.map(async (imageId) => {
    const imageIdObjectId = ObjectId.createFromHexString(imageId);
    const imageDocument = (await databaseValidateImageIdObjectId(
      imageIdObjectId,
      true
    )) as ImageDocument;
    const imageRef = imageDocument.fileRefFirebaseStorage;
    const bucketFile = bucket.file(imageRef!);
    await bucketFile.delete();
    await imageDocument.deleteOne();
  });

  return res.status(200).json({ success: true, message: "well done" });
}
