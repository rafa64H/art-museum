import { Request, Response } from "express";
import { AuthMiddlewareRequest } from "../middleware/verifyJWT";
import { ObjectId } from "mongodb";
import { UserModel } from "../models/user.model";
import { PostModel } from "../models/post.model";
import { CommentDocument, CommentModel } from "../models/comment.model";
import { ReplyModel } from "../models/reply.model";

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

    const { title, content, tags } = req.body as {
      title: string;
      content: string | null;
      tags: string[];
    };

    if (!title)
      return res
        .status(400)
        .json({ success: false, message: "Title not found, it is required" });

    const newPost = new PostModel({
      authorId: userIdObjectId,
      title: title,
      content: content ? content : "",
      tags: tags ? tags : [],
    });
    await newPost.save();

    const newPostId = newPost._id as ObjectId;
    const newPostObjectToReturn = {
      ...newPost.toObject(),
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

    const commentsObjects = comments.map((comment) => {
      return comment.toObject();
    });

    res.status(200).json({ success: true, comments: commentsObjects });
  } catch (error) {
    res.status(500).json({ success: false, message: "internal server error" });
    console.log(error);
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

export async function getAllRepliesHandler(req: Request, res: Response) {
  try {
    const { postId, commentId } = req.params;

    const postIdObjectId = ObjectId.createFromHexString(postId);
    const foundPost = await PostModel.findOne(postIdObjectId);

    if (!foundPost)
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });

    const commentIdObjectId = ObjectId.createFromHexString(commentId);
    const foundComment = await CommentModel.findOne(commentIdObjectId);

    if (!foundComment)
      return res
        .status(404)
        .json({ success: false, message: "Comment not found" });

    const replies = (await ReplyModel.find({
      commentId: commentIdObjectId,
    })) as CommentDocument[] | [];

    const repliesObjects = replies.map((reply) => {
      return reply.toObject();
    });

    res.status(200).json({ success: true, replies: repliesObjects });
  } catch (error) {
    res.status(500).json({ success: false, message: "internal server error" });
    console.log(error);
  }
}

export async function createReplyHandler(
  req: AuthMiddlewareRequest,
  res: Response
) {
  try {
    const userId = req.userId;
    const { postId, commentId } = req.params;

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

    const postIdObjectId = ObjectId.createFromHexString(postId);
    const foundPost = await PostModel.findOne(postIdObjectId);

    if (!foundPost)
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });

    const commentIdObjectId = ObjectId.createFromHexString(commentId);
    const foundComment = await CommentModel.findOne(commentIdObjectId);

    if (!foundComment)
      return res
        .status(404)
        .json({ success: false, message: "Comment not found" });

    const { content } = req.body as { content: string };

    const newReply = new ReplyModel({
      postId: postIdObjectId,
      authorId: userIdObjectId,
      content: content,
      commentId: commentIdObjectId,
    });

    await newReply.save();

    res.status(201).json({
      success: true,
      message: "Comment created successfully",
      newComment: { ...newReply.toObject() },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "internal server error" });
    console.log(error);
  }
}

export async function editReplyHandler(
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

    const { postId, commentId, replyId } = req.params;

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

    const replyIdObjectId = ObjectId.createFromHexString(replyId);
    const foundReply = await ReplyModel.findOne(replyIdObjectId);
    if (!foundReply)
      return res
        .status(404)
        .json({ success: false, message: "Reply not found" });

    if (foundReply.authorId.toString() !== userId)
      return res
        .status(401)
        .json({ success: false, message: `Not same user as comment's author` });

    const { content } = req.body as { content: string };

    foundReply.content = content;

    await foundComment.save();

    res.status(200).json({
      success: true,
      message: "Reply edited successfully",
      editedComment: { ...foundReply.toObject() },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "internal server error" });
  }
}
