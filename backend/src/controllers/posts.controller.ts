import { Response } from "express";
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

    const { title, content } = req.body as {
      title: string;
      content: string | null;
    };

    if (!title)
      return res
        .status(400)
        .json({ success: false, message: "Title not found, it is required" });

    const newPost = new PostModel({
      authorId: userIdObjectId,
      title: title,
      content: content ? content : "",
    });

    await newPost.save();

    const newPostId = newPost._id as ObjectId;
    const newPostObjectToReturn = {
      ...newPost.toObject(),
      id: newPostId.toString(),
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
