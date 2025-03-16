import { Request, Response } from "express";
import { AuthMiddlewareRequest } from "../middleware/verifyJWT";
import { UserModel } from "../models/user.model";
import { PostModel } from "../models/post.model";
import { CommentDocument, CommentModel } from "../models/comment.model";
import { ReplyModel } from "../models/reply.model";
import { ObjectId } from "mongodb";
import CustomError from "../constants/customError";
import createPostDatabaseValidator from "../utils/validation/database/posts-routes/createPostDatabaseValidator";
import likeOrDislikeDatabaseValidator from "../utils/validation/database/posts-routes/likeOrDislikeDatabaseValidator";
import createCommentDatabaseValidator from "../utils/validation/database/posts-routes/createCommentDatabaseValidator";
import { editCommentDatabaseValidator } from "../utils/validation/database/posts-routes/editCommentDatabaseValidator";
import getAllRepliesFromCommentDatabaseValidator from "../utils/validation/database/posts-routes/getAllRepliesFromCommentDatabaseValidator";
import { validatePostsRoutesRequest } from "../utils/validation/joi/validatePostsRoutesRequestJoi";

export async function createPostHandler(
  req: AuthMiddlewareRequest,
  res: Response
) {
  const { userId, title, content, tags } = req.body as {
    userId: unknown;
    title: unknown;
    content: unknown;
    tags: unknown;
  };

  validatePostsRoutesRequest({
    userId,
    postTitle: title,
    postContent: content,
    postTags: tags,
  });

  const validatedUserId = userId as string;
  const validatedTitle = title as string;
  const validatedContent = content as string;
  const validatedTags = tags as string[];

  await createPostDatabaseValidator({
    userId: validatedUserId,
    title: validatedTitle,
    content: validatedContent,
    tags: validatedTags,
  });

  const userIdObjectId = ObjectId.createFromHexString(validatedUserId);

  const newPost = new PostModel({
    authorId: userIdObjectId,
    title: title,
    content: content ? content : "",
    tags: tags ? tags : [],
  });
  await newPost.save();

  res.status(201).json({
    success: true,
    post: newPost.toObject(),
    message: "Post created successfully",
  });
}

export async function getSinglePostHandler(req: Request, res: Response) {
  const { postId } = req.params;

  validatePostsRoutesRequest({ postId });

  const validatedPostId = postId as string;
  const postIdObjectId = ObjectId.createFromHexString(validatedPostId);
  const foundPost = await PostModel.findOne(postIdObjectId);
  if (!foundPost) throw new CustomError(404, "Post not found with such id");

  const postObjectToReturn = {
    ...foundPost.toObject(),
  };

  res.status(200).json({ success: true, post: postObjectToReturn });
}

export async function likePostHandler(
  req: AuthMiddlewareRequest,
  res: Response
) {
  const userId = req.userId;
  const postId = req.params.postId;

  validatePostsRoutesRequest({ userId, postId });

  const validatedUserId = userId as string;
  const validatedpostId = postId as string;

  const postIdObjectId = ObjectId.createFromHexString(validatedpostId);
  const userIdObjectId = ObjectId.createFromHexString(validatedUserId);

  const postDocument = await likeOrDislikeDatabaseValidator({
    postId: postIdObjectId,
    userId: userIdObjectId,
  });

  const findIfUserDislikedPost = postDocument.likes.find(
    (likeUserId) => likeUserId === userId
  );

  const findIfUserLikedPost = postDocument.likes.find(
    (likeUserId) => likeUserId === userId
  );
  if (findIfUserDislikedPost) {
    postDocument.dislikes = postDocument.dislikes.filter(
      (dislikeUserId) => dislikeUserId !== userId
    );
  }
  if (findIfUserLikedPost) {
    postDocument.likes.filter((likeUserId) => likeUserId !== userId);
    return res.status(200).json({ success: true, message: "Like removed" });
  }

  postDocument.likes.push(validatedUserId);

  await postDocument.save();

  res.status(200).json({ success: true, message: "Like added successfully" });
}

export async function dislikePostHandler(
  req: AuthMiddlewareRequest,
  res: Response
) {
  const userId = req.userId;
  const postId = req.params.postId;

  validatePostsRoutesRequest({ userId, postId });

  const validatedUserId = userId as string;
  const validatedpostId = postId as string;

  const postIdObjectId = ObjectId.createFromHexString(validatedpostId);
  const userIdObjectId = ObjectId.createFromHexString(validatedUserId);

  const postDocument = await likeOrDislikeDatabaseValidator({
    postId: postIdObjectId,
    userId: userIdObjectId,
  });

  const findIfUserLikedPost = postDocument.likes.find(
    (likeUserId) => likeUserId === validatedUserId
  );

  const findIfUserDislikedPost = postDocument.dislikes.find(
    (dislikeUserId) => dislikeUserId === validatedUserId
  );

  if (findIfUserLikedPost) {
    postDocument.likes = postDocument.likes.filter(
      (likeUserId) => likeUserId !== validatedUserId
    );
  }
  if (findIfUserDislikedPost) {
    postDocument.dislikes = postDocument.dislikes.filter(
      (dislikeUserId) => dislikeUserId !== userId
    );
    return res.status(200).json({ success: false, message: "Dislike removed" });
  }
  postDocument.dislikes.push(validatedUserId);

  await postDocument.save();

  res.status(200).json({ success: true, message: "Like added successfully" });
}

export async function getAllCommentsHandler(req: Request, res: Response) {
  const { postId } = req.params;

  validatePostsRoutesRequest({ postId });

  const postIdObjectId = ObjectId.createFromHexString(postId);

  const foundPost = await PostModel.findOne(postIdObjectId);

  if (!foundPost) throw new CustomError(404, "Post not found with such id");

  const comments = (await CommentModel.find({
    postId: postIdObjectId,
  })) as CommentDocument[] | [];

  const commentsObjects = comments.map((comment) => {
    return comment.toObject();
  });

  res.status(200).json({ success: true, comments: commentsObjects });
}

export async function createCommentHandler(
  req: AuthMiddlewareRequest,
  res: Response
) {
  const userId = req.userId;

  const { postId } = req.params;
  const { content } = req.body as { content: unknown };

  validatePostsRoutesRequest({
    userId,
    postId,
    contentCommentOrReply: content,
  });

  const validatedUserId = userId as string;
  const validatedPostId = postId as string;
  const validatedContent = content as string;

  const userIdObjectId = ObjectId.createFromHexString(validatedUserId);
  const postIdObjectId = ObjectId.createFromHexString(validatedPostId);

  await createCommentDatabaseValidator({
    userId: userIdObjectId,
    postId: postIdObjectId,
  });

  const newComment = new CommentModel({
    postId: postIdObjectId,
    authorId: userIdObjectId,
    content: validatedContent,
  });

  await newComment.save();

  res.status(201).json({
    success: true,
    message: "Comment created successfully",
    newComment: { ...newComment.toObject() },
  });
}

export async function editCommentHandler(
  req: AuthMiddlewareRequest,
  res: Response
) {
  const userId = req.userId;
  const { postId, commentId } = req.params;
  const { content } = req.body as { content: unknown };

  validatePostsRoutesRequest({
    userId,
    postId,
    commentId,
    contentCommentOrReply: content,
  });
  const validatedUserId = userId as string;
  const validatedPostId = postId as string;
  const validatedCommentId = commentId as string;
  const validatedContent = content as string;
  const userIdObjectId = ObjectId.createFromHexString(validatedUserId);
  const postIdObjectId = ObjectId.createFromHexString(validatedPostId);
  const commentIdObjectId = ObjectId.createFromHexString(validatedCommentId);

  const commentDocument = await editCommentDatabaseValidator({
    userId: userIdObjectId,
    postId: postIdObjectId,
    commentId: commentIdObjectId,
  });

  commentDocument.content = validatedContent;

  await commentDocument.save();

  res.status(200).json({
    success: true,
    message: "Comment edited successfully",
    editedComment: commentDocument.toObject(),
  });
}

export async function getAllRepliesFromCommentHandler(
  req: Request,
  res: Response
) {
  const { postId, commentId } = req.params;

  validatePostsRoutesRequest({ postId, commentId });

  const postIdObjectId = ObjectId.createFromHexString(postId);
  const commentIdObjectId = ObjectId.createFromHexString(commentId);

  await getAllRepliesFromCommentDatabaseValidator({
    postId: postIdObjectId,
    commentId: commentIdObjectId,
  });

  const replies = (await ReplyModel.find({
    commentId: commentIdObjectId,
  })) as CommentDocument[] | [];

  const repliesObjects = replies.map((reply) => {
    return reply.toObject();
  });

  res.status(200).json({ success: true, replies: repliesObjects });
}

export async function createReplyHandler(
  req: AuthMiddlewareRequest,
  res: Response
) {
  const userId = req.userId;
  const { postId, commentId } = req.params;

  if (!userId) throw new CustomError(401, "Unauthorized");
  const userIdObjectId = ObjectId.createFromHexString(userId);
  const foundUser = await UserModel.findOne(userIdObjectId);
  if (!foundUser) throw new CustomError(401, "Unauthorized");

  const postIdObjectId = ObjectId.createFromHexString(postId);
  const foundPost = await PostModel.findOne(postIdObjectId);

  if (!foundPost) throw new CustomError(404, "Post not found with such id");

  const commentIdObjectId = ObjectId.createFromHexString(commentId);
  const foundComment = await CommentModel.findOne(commentIdObjectId);

  if (!foundComment)
    throw new CustomError(404, "Comment not found with such id");

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
}

export async function editReplyHandler(
  req: AuthMiddlewareRequest,
  res: Response
) {
  const userId = req.userId;
  if (!userId) throw new CustomError(401, "Unauthorized");
  const userIdObjectId = ObjectId.createFromHexString(userId);
  const foundUser = await UserModel.findOne(userIdObjectId);
  if (!foundUser) throw new CustomError(401, "Unauthorized");

  const { postId, commentId, replyId } = req.params;

  const postIdObjectId = ObjectId.createFromHexString(postId);
  const foundPost = await PostModel.findOne(postIdObjectId);

  if (!foundPost) throw new CustomError(404, "Post not found with such id");

  const commentIdObjectId = ObjectId.createFromHexString(commentId);
  const foundComment = (await CommentModel.findOne(
    commentIdObjectId
  )) as CommentDocument;

  if (!foundComment)
    throw new CustomError(404, "Comment not found with such id");

  const replyIdObjectId = ObjectId.createFromHexString(replyId);
  const foundReply = await ReplyModel.findOne(replyIdObjectId);
  if (!foundReply) throw new CustomError(404, "Reply not found with such id");

  if (foundReply.authorId.toString() !== userId)
    throw new CustomError(401, "Not same user as reply's author");

  const { content } = req.body as { content: string };

  foundReply.content = content;

  await foundComment.save();

  res.status(200).json({
    success: true,
    message: "Reply edited successfully",
    editedComment: { ...foundReply.toObject() },
  });
}

export async function likeCommentHandler(
  req: AuthMiddlewareRequest,
  res: Response
) {
  const userId = req.userId;
  if (!userId) throw new CustomError(401, "Unauthorized");
  const userIdObjectId = ObjectId.createFromHexString(userId);
  const foundUser = await UserModel.findOne(userIdObjectId);
  if (!foundUser) throw new CustomError(401, "Unauthorized");

  const { postId } = req.params;

  if (!postId) throw new CustomError(400, "No postId provided");
  const postIdObjectId = ObjectId.createFromHexString(postId);
  const foundPost = await PostModel.findOne(postIdObjectId);

  if (!foundPost) throw new CustomError(404, "Post not found with such id");

  const { commentId } = req.params;
  if (!commentId) throw new CustomError(404, "No commentId provided");
  const commentIdObjectId = ObjectId.createFromHexString(commentId);

  const foundComment = await CommentModel.findOne(commentIdObjectId);

  if (!foundComment)
    throw new CustomError(404, "Comment not found with such id");

  const findIfUserDislikedComment = foundComment.dislikes.find(
    (likeUserId) => likeUserId === userId
  );

  const findIfUserLikedComment = foundComment.likes.find(
    (likeUserId) => likeUserId === userId
  );

  if (findIfUserDislikedComment) {
    foundComment.dislikes = foundComment.dislikes.filter(
      (likeUserId) => likeUserId !== userId
    );
  }

  if (findIfUserLikedComment)
    return res
      .status(400)
      .json({ success: false, message: "Comment already liked by user" });

  foundComment.likes.push(userId);
  await foundComment.save();

  res.status(201).json({
    success: true,
    message: "Comment liked successfully",
  });
}

export async function dislikeCommentHandler(
  req: AuthMiddlewareRequest,
  res: Response
) {
  const userId = req.userId;
  if (!userId) throw new CustomError(401, "Unauthorized");
  const userIdObjectId = ObjectId.createFromHexString(userId);
  const foundUser = await UserModel.findOne(userIdObjectId);
  if (!foundUser) throw new CustomError(401, "Unauthorized");

  const { postId } = req.params;

  if (!postId) throw new CustomError(400, "No postId provided");
  const postIdObjectId = ObjectId.createFromHexString(postId);
  const foundPost = await PostModel.findOne(postIdObjectId);

  if (!foundPost) throw new CustomError(404, "Post not found with such id");

  const { commentId } = req.params;
  if (!commentId) throw new CustomError(400, "No commentId provided");
  const commentIdObjectId = ObjectId.createFromHexString(commentId);

  const foundComment = await CommentModel.findOne(commentIdObjectId);

  if (!foundComment)
    throw new CustomError(404, "Comment not found with such id");

  const findIfUserLikedComment = foundComment.likes.find(
    (likeUserId) => likeUserId === userId
  );

  const findIfUserDislikedComment = foundComment.dislikes.find(
    (likeUserId) => likeUserId === userId
  );

  if (findIfUserLikedComment) {
    foundComment.likes = foundComment.likes.filter(
      (likeUserId) => likeUserId !== userId
    );
  }

  if (findIfUserDislikedComment)
    return res
      .status(400)
      .json({ success: false, message: "Comment already disliked by user" });

  foundComment.dislikes.push(userId);
  await foundComment.save();

  res.status(201).json({
    success: true,
    message: "Comment disliked successfully",
  });
}

export async function likeReplyHandler(
  req: AuthMiddlewareRequest,
  res: Response
) {
  const userId = req.userId;
  if (!userId) throw new CustomError(401, "Unauthorized");
  const userIdObjectId = ObjectId.createFromHexString(userId);
  const foundUser = await UserModel.findOne(userIdObjectId);
  if (!foundUser) throw new CustomError(401, "Unauthorized");

  const { postId } = req.params;

  if (!postId) throw new CustomError(400, "No postId provided");
  const postIdObjectId = ObjectId.createFromHexString(postId);
  const foundPost = await PostModel.findOne(postIdObjectId);

  if (!foundPost) throw new CustomError(404, "Post not found with such id");

  const { commentId } = req.params;
  if (!commentId) throw new CustomError(400, "No commentId provided");
  const commentIdObjectId = ObjectId.createFromHexString(commentId);

  const foundComment = await CommentModel.findOne(commentIdObjectId);

  if (!foundComment)
    throw new CustomError(404, "Comment not found with such id");

  const { replyId } = req.params;
  if (!replyId) throw new CustomError(400, "No replyId provided");

  const replyIdObjectId = ObjectId.createFromHexString(replyId);
  const foundReply = await ReplyModel.findOne(replyIdObjectId);
  if (!foundReply) throw new CustomError(404, "Reply not found with such id");

  const findIfUserDislikedReply = foundReply.dislikes.find(
    (likeUserId) => likeUserId === userId
  );

  const findIfUserLikedReply = foundReply.likes.find(
    (likeUserId) => likeUserId === userId
  );

  if (findIfUserDislikedReply) {
    foundReply.dislikes = foundReply.dislikes.filter(
      (likeUserId) => likeUserId !== userId
    );
  }

  if (findIfUserLikedReply)
    return res
      .status(400)
      .json({ success: false, message: "Reply already liked by user" });

  foundReply.likes.push(userId);
  await foundReply.save();

  res.status(201).json({
    success: true,
    message: "Comment liked successfully",
  });
}

export async function dislikeReplyHandler(
  req: AuthMiddlewareRequest,
  res: Response
) {
  const userId = req.userId;
  if (!userId) throw new CustomError(401, "Unauthorized");
  const userIdObjectId = ObjectId.createFromHexString(userId);
  const foundUser = await UserModel.findOne(userIdObjectId);
  if (!foundUser) throw new CustomError(401, "Unauthorized");

  const { postId } = req.params;

  if (!postId) throw new CustomError(400, "No postId provided");
  const postIdObjectId = ObjectId.createFromHexString(postId);
  const foundPost = await PostModel.findOne(postIdObjectId);

  if (!foundPost) throw new CustomError(404, "Post not found with such id");

  const { commentId } = req.params;
  if (!commentId) throw new CustomError(400, "No commentId provided");
  const commentIdObjectId = ObjectId.createFromHexString(commentId);

  const foundComment = await CommentModel.findOne(commentIdObjectId);

  if (!foundComment)
    throw new CustomError(404, "Comment not found with such id");

  const { replyId } = req.params;
  if (!replyId) throw new CustomError(400, "No replyId provided");

  const replyIdObjectId = ObjectId.createFromHexString(replyId);
  const foundReply = await ReplyModel.findOne(replyIdObjectId);
  if (!foundReply) throw new CustomError(404, "Reply not found with such id");

  const findIfUserLikedReply = foundReply.likes.find(
    (likeUserId) => likeUserId === userId
  );

  const findIfUserDislikedReply = foundReply.dislikes.find(
    (likeUserId) => likeUserId === userId
  );

  if (findIfUserLikedReply) {
    foundReply.likes = foundReply.likes.filter(
      (likeUserId) => likeUserId !== userId
    );
  }

  if (findIfUserDislikedReply)
    return res
      .status(400)
      .json({ success: false, message: "Reply already liked by user" });

  foundReply.dislikes.push(userId);

  await foundReply.save();

  res.status(201).json({
    success: true,
    message: "Comment liked successfully",
  });
}
