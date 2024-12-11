import { Request, Response } from "express";
import { AuthMiddlewareRequest } from "../middleware/verifyJWT";
import { ObjectId } from "mongodb";
import { UserModel } from "../models/user.model";
import { PostModel } from "../models/post.model";

export async function createPostHandler(
  req: AuthMiddlewareRequest,
  res: Response
) {
  try {
    const userId = req.userId;
    if (!userId)
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized to create post" });
    const userIdObjectId = ObjectId.createFromHexString(userId);
    const foundUser = await UserModel.findOne(userIdObjectId);
    if (!foundUser)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    const { title, content, imageURLs, imageIds } = req.body as {
      title: string;
      content: string | null;
      imageURLs: string[] | null;
      imageIds: string[] | null;
    };

    const imageIdsObjectIds = imageIds?.map((imageId) => {
      return ObjectId.createFromHexString(imageId);
    });

    if (!title)
      return res
        .status(400)
        .json({ success: false, message: "Title not found, it is required" });

    const newPost = new PostModel({
      authorId: userIdObjectId,
      title: title,
      content: content ? content : "",
      imageURLs: imageURLs ? imageURLs : null,
      imageIds: imageIdsObjectIds ? imageIdsObjectIds : null,
    });
    await newPost.save();

    const newPostId = newPost._id as ObjectId;
    const newPostObjectToReturn = {
      ...newPost.toObject(),
      _id: newPostId.toString(),
    };

    res.status(201).json({
      success: true,
      post: newPostObjectToReturn,
      message: "Post created successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "internal server error", error: error });
  }
}

export async function getSinglePostHandler(req: Request, res: Response) {
  try {
    const { postId } = req.params;

    if (!postId)
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });

    const postIdObjectId = ObjectId.createFromHexString(postId);
    const foundPost = await PostModel.findOne(postIdObjectId);
    if (!foundPost)
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });

    const postObjectToReturn = {
      ...foundPost.toObject(),
      _id: postId, //To not be an ObjectId but a string
      authorId: foundPost.authorId.toString(),
    };

    res.status(200).json({ success: true, post: postObjectToReturn });
  } catch (error) {
    res.status(500).json({ success: false, message: "internal server error" });
  }
}
