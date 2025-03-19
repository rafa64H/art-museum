import { Request, Response } from "express";
import { AuthMiddlewareRequest } from "../middleware/verifyJWT";
import { UserDocument, UserModel } from "../models/user.model";
import { PostDocument, PostModel } from "../models/post.model";
import { CommentDocument, CommentModel } from "../models/comment.model";
import { ReplyDocument, ReplyModel } from "../models/reply.model";
import { ObjectId } from "mongodb";
import CustomError from "../constants/customError";
import { validatePostsRoutesRequest } from "../utils/validation/joi/validatePostsRoutesRequestJoi";
import databaseValidatePostIdFromParam from "../utils/validation/database/posts-routes/databaseValidatePostIdFromParam";
import databaseValidateCommentIdFromParam from "../utils/validation/database/posts-routes/databaseValidateCommentIdFromParam";
import databaseValidateUserIdObjectId from "../utils/validation/database/databaseValidateUserIdObjectId";
import databaseValidateReplyIdFromParam from "../utils/validation/database/posts-routes/databaseValidateReplyIdFromParam";

export async function createPostHandler(
  req: AuthMiddlewareRequest,
  res: Response
) {
  const userId = req.userId;
  const { title, content, tags } = req.body as {
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
  const validatedContent = content as string | null;
  const validatedTags = tags as string[];
  const userIdObjectId = ObjectId.createFromHexString(validatedUserId);

  await databaseValidateUserIdObjectId(userIdObjectId, false);

  const newPost = new PostModel({
    authorId: userIdObjectId,
    title: validatedTitle,
    content: validatedContent ? validatedContent : "",
    tags: validatedTags,
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
  const foundPost = (await databaseValidatePostIdFromParam(
    postIdObjectId,
    true
  )) as PostDocument;

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

  await databaseValidateUserIdObjectId(userIdObjectId, false);

  const postDocument = (await databaseValidatePostIdFromParam(
    postIdObjectId,
    true
  )) as PostDocument;

  await PostModel.findOneAndUpdate(
    { _id: postIdObjectId },
    { $pull: { dislikes: validatedUserId }, $push: { likes: validatedUserId } }
  );

  const findIfUserDislikedPost = postDocument.likes.includes(validatedUserId);

  const findIfUserLikedPost = postDocument.likes.includes(validatedUserId);

  if (findIfUserDislikedPost) {
    await postDocument.updateOne({ $pull: { dislikes: validatedUserId } });
  }
  if (findIfUserLikedPost) {
    await postDocument.updateOne({ $pull: { likes: validatedUserId } });
    return res.status(200).json({ success: true, message: "Like removed" });
  }

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

  await databaseValidateUserIdObjectId(userIdObjectId, false);

  const postDocument = (await databaseValidatePostIdFromParam(
    postIdObjectId,
    true
  )) as PostDocument;

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
      (dislikeUserId) => dislikeUserId !== validatedUserId
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

  const foundPost = (await databaseValidatePostIdFromParam(
    postIdObjectId,
    true
  )) as PostDocument;

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

  await databaseValidateUserIdObjectId(userIdObjectId, false);
  await databaseValidatePostIdFromParam(postIdObjectId, false);

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

  await databaseValidateUserIdObjectId(userIdObjectId, false);
  await databaseValidatePostIdFromParam(postIdObjectId, false);

  const commentDocument = (await databaseValidateCommentIdFromParam(
    commentIdObjectId,
    true
  )) as CommentDocument;

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

  await databaseValidatePostIdFromParam(postIdObjectId, false);
  await databaseValidateCommentIdFromParam(commentIdObjectId, false);

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
  await databaseValidateUserIdObjectId(userIdObjectId, false);
  const postIdObjectId = ObjectId.createFromHexString(validatedPostId);
  await databaseValidatePostIdFromParam(postIdObjectId, false);
  const commentIdObjectId = ObjectId.createFromHexString(validatedCommentId);
  await databaseValidateCommentIdFromParam(commentIdObjectId, false);

  const newReply = new ReplyModel({
    postId: postIdObjectId,
    authorId: userIdObjectId,
    content: validatedContent,
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
  const { postId, commentId, replyId } = req.params;
  const { content } = req.body as { content: unknown };

  validatePostsRoutesRequest({
    userId,
    postId,
    commentId,
    replyId,
    contentCommentOrReply: content,
  });

  const validatedUserId = userId as string;
  const validatedPostId = postId as string;
  const validatedCommentId = commentId as string;
  const validatedReplyId = replyId as string;
  const validatedContent = content as string;

  const userIdObjectId = ObjectId.createFromHexString(validatedUserId);
  await databaseValidateUserIdObjectId(userIdObjectId, false);
  const postIdObjectId = ObjectId.createFromHexString(validatedPostId);
  await databaseValidatePostIdFromParam(postIdObjectId, false);
  const commentIdObjectId = ObjectId.createFromHexString(validatedCommentId);
  await databaseValidateCommentIdFromParam(commentIdObjectId, false);

  const replyIdObjectId = ObjectId.createFromHexString(validatedReplyId);
  const foundReply = (await databaseValidateReplyIdFromParam(
    replyIdObjectId,
    true
  )) as ReplyDocument;

  if (foundReply.authorId.toString() !== userId)
    throw new CustomError(401, "Not same user as reply's author");

  foundReply.content = validatedContent;

  await foundReply.save();

  res.status(200).json({
    success: true,
    message: "Reply edited successfully",
    editedReply: { ...foundReply.toObject() },
  });
}

export async function likeCommentHandler(
  req: AuthMiddlewareRequest,
  res: Response
) {
  const userId = req.userId;

  const { postId, commentId } = req.params;

  validatePostsRoutesRequest({ userId, postId, commentId });

  const validatedUserId = userId as string;
  const validatedPostId = postId as string;
  const validatedCommentId = commentId as string;

  const userIdObjectId = ObjectId.createFromHexString(validatedUserId);
  await databaseValidateUserIdObjectId(userIdObjectId, false);
  const postIdObjectId = ObjectId.createFromHexString(validatedPostId);
  await databaseValidatePostIdFromParam(postIdObjectId, false);

  const commentIdObjectId = ObjectId.createFromHexString(validatedCommentId);
  const foundComment = (await databaseValidateCommentIdFromParam(
    commentIdObjectId,
    true
  )) as CommentDocument;

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

  if (findIfUserLikedComment) {
    foundComment.dislikes = foundComment.likes.filter(
      (likeUserId) => likeUserId !== validatedUserId
    );
    return res
      .status(200)
      .json({ success: true, message: "Like removed from comment" });
  }

  foundComment.likes.push(validatedUserId);
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

  const { postId, commentId } = req.params;

  validatePostsRoutesRequest({ userId, postId, commentId });

  const validatedUserId = userId as string;
  const validatedPostId = postId as string;
  const validatedCommentId = commentId as string;

  const userIdObjectId = ObjectId.createFromHexString(validatedUserId);
  await databaseValidateUserIdObjectId(userIdObjectId, false);
  const postIdObjectId = ObjectId.createFromHexString(validatedPostId);
  await databaseValidatePostIdFromParam(postIdObjectId, false);

  const commentIdObjectId = ObjectId.createFromHexString(validatedCommentId);
  const foundComment = (await databaseValidateCommentIdFromParam(
    commentIdObjectId,
    true
  )) as CommentDocument;

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

  if (findIfUserDislikedComment) {
    foundComment.dislikes.filter(
      (dislikeUserId) => dislikeUserId !== validatedUserId
    );
    return res
      .status(200)
      .json({ success: true, message: "Dislike removed from comment" });
  }

  foundComment.dislikes.push(validatedUserId);
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

  const { postId, commentId, replyId } = req.params;

  validatePostsRoutesRequest({ userId, postId, commentId, replyId });

  const validatedUserId = userId as string;
  const validatedPostId = postId as string;
  const validatedCommentId = commentId as string;
  const validatedReplyId = replyId as string;

  const userIdObjectId = ObjectId.createFromHexString(validatedUserId);
  await databaseValidateUserIdObjectId(userIdObjectId, false);
  const postIdObjectId = ObjectId.createFromHexString(validatedPostId);
  await databaseValidatePostIdFromParam(postIdObjectId, false);
  const commentIdObjectId = ObjectId.createFromHexString(validatedCommentId);
  await databaseValidateCommentIdFromParam(commentIdObjectId, false);

  const replyIdObjectId = ObjectId.createFromHexString(validatedReplyId);
  const foundReply = (await databaseValidateReplyIdFromParam(
    replyIdObjectId,
    true
  )) as ReplyDocument;

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

  if (findIfUserLikedReply) {
    foundReply.likes = foundReply.likes.filter(
      (likeUserId) => likeUserId !== validatedUserId
    );

    return res
      .status(200)
      .json({ success: true, message: "Like removed from reply" });
  }

  foundReply.likes.push(validatedUserId);
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

  const { postId, commentId, replyId } = req.params;

  validatePostsRoutesRequest({ userId, postId, commentId, replyId });

  const validatedUserId = userId as string;
  const validatedPostId = postId as string;
  const validatedCommentId = commentId as string;
  const validatedReplyId = replyId as string;

  const userIdObjectId = ObjectId.createFromHexString(validatedUserId);
  await databaseValidateUserIdObjectId(userIdObjectId, false);
  const postIdObjectId = ObjectId.createFromHexString(validatedPostId);
  await databaseValidatePostIdFromParam(postIdObjectId, false);
  const commentIdObjectId = ObjectId.createFromHexString(validatedCommentId);
  await databaseValidateCommentIdFromParam(commentIdObjectId, false);

  const replyIdObjectId = ObjectId.createFromHexString(validatedReplyId);
  const foundReply = (await databaseValidateReplyIdFromParam(
    replyIdObjectId,
    true
  )) as ReplyDocument;

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

  if (findIfUserDislikedReply) {
    foundReply.dislikes = foundReply.dislikes.filter(
      (dislikeUserId) => dislikeUserId !== validatedUserId
    );
  }

  foundReply.dislikes.push(validatedUserId);

  await foundReply.save();

  res.status(201).json({
    success: true,
    message: "Comment liked successfully",
  });
}
