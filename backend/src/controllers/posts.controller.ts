import { Request, Response } from "express";
import { AuthMiddlewareRequest } from "../middleware/verifyJWT";
import { ObjectId } from "mongodb";
import { UserModel } from "../models/user.model";
import { PostModel } from "../models/post.model";
import { CommentDocument, CommentModel } from "../models/comment.model";

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

    const { title, content, imageURLs, imageIds, tags } = req.body as {
      title: string;
      content: string | null;
      imageURLs: string[] | null;
      imageIds: string[] | null;
      tags: string[];
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
      tags: tags ? tags : [],
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

export async function getAllCommentsHandler(req: Request, res: Response) {
  try {
    const { postId } = req.params;

    const postIdObjectId = ObjectId.createFromHexString(postId);
    const foundPost = await PostModel.findOne(postIdObjectId);

    if (!foundPost)
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });

    const comments = (await CommentModel.find({
      postId: postIdObjectId,
    })) as CommentDocument[] | [];

    if (!comments)
      return res
        .status(500)
        .json({ success: false, message: "internal server error" });

    const commentsObjects = comments.map((comment) => {
      comment.toObject();
    });

    res.status(200).json({ success: true, comments: commentsObjects });
  } catch (error) {
    res.status(500).json({ success: false, message: "internal server error" });
  }
}

export async function createCommentHandler(
  req: AuthMiddlewareRequest,
  res: Response
) {
  try {
    const userId = req.userId;
    if (!userId)
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized to create comment" });
    const userIdObjectId = ObjectId.createFromHexString(userId);
    const foundUser = await UserModel.findOne(userIdObjectId);
    if (!foundUser)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    const { postId } = req.params;

    const postIdObjectId = ObjectId.createFromHexString(postId);
    const foundPost = await PostModel.findOne(postIdObjectId);

    if (!foundPost)
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });

    const { content } = req.body as { content: string };

    const newComment = new CommentModel({
      postId: postIdObjectId,
      authorId: userIdObjectId,
      content: content,
    });

    await newComment.save();

    res.status(201).json({
      success: true,
      message: "Comment created successfully",
      newComment: { ...newComment.toObject() },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "internal server error" });
    console.log(error);
  }
}

export async function editCommentHandler(
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

    const { postId, commentId } = req.params;

    const postIdObjectId = ObjectId.createFromHexString(postId);
    const foundPost = await PostModel.findOne(postIdObjectId);

    if (!foundPost)
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });

    const commentIdObjectId = ObjectId.createFromHexString(commentId);
    const foundComment = (await CommentModel.findOne(
      commentIdObjectId
    )) as CommentDocument;

    if (!foundComment)
      return res
        .status(404)
        .json({ success: false, message: "Comment not found" });

    if (foundComment.authorId.toString() !== userId)
      return res
        .status(401)
        .json({ success: false, message: `Not same user as comment's author` });

    const { content } = req.body as { content: string };

    foundComment.content = content;

    await foundComment.save();

    res.status(200).json({
      success: true,
      message: "Comment edited successfully",
      editedComment: { ...foundComment.toObject() },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "internal server error" });
  }
}
