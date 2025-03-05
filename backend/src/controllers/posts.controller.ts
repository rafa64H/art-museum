import { Request, Response } from "express";
import { AuthMiddlewareRequest } from "../middleware/verifyJWT";
import { UserModel } from "../models/user.model";
import { PostModel } from "../models/post.model";
import { CommentDocument, CommentModel } from "../models/comment.model";
import { ReplyModel } from "../models/reply.model";
import { ObjectId } from "mongodb";

export async function createPostHandler(
  req: AuthMiddlewareRequest,
  res: Response
) {
  const userId = req.userId;
  if (!userId)
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized to create post" });
  const userIdObjectId = ObjectId.createFromHexString(userId);
  const foundUser = await UserModel.findOne(userIdObjectId);
  if (!foundUser)
    return res.status(404).json({ success: false, message: "User not found" });

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
}

export async function getSinglePostHandler(req: Request, res: Response) {
  const { postId } = req.params;

  if (!postId)
    return res.status(404).json({ success: false, message: "Post not found" });

  const postIdObjectId = ObjectId.createFromHexString(postId);
  const foundPost = await PostModel.findOne(postIdObjectId);
  if (!foundPost)
    return res.status(404).json({ success: false, message: "Post not found" });

  const postObjectToReturn = {
    ...foundPost.toObject(),
    _id: postId, //To not be an ObjectId but a string
    authorId: foundPost.authorId.toString(),
  };

  res.status(200).json({ success: true, post: postObjectToReturn });
}

export async function likePostHandler(
  req: AuthMiddlewareRequest,
  res: Response
) {
  const userId = req.userId;
  if (!userId)
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized to add like to post" });
  const userIdObjectId = ObjectId.createFromHexString(userId);
  const foundUser = await UserModel.findOne(userIdObjectId);
  if (!foundUser)
    return res.status(404).json({ success: false, message: "User not found" });

  const postId = req.params.postId;
  const postIdObjectId = ObjectId.createFromHexString(postId);
  const foundPost = await PostModel.findOne(postIdObjectId);
  if (!foundPost)
    return res
      .status(404)
      .json({ success: false, message: "Post not found with such id" });

  const findIfUserDislikedPost = foundPost.likes.find(
    (likeUserId) => likeUserId === userId
  );

  const findIfUserLikedPost = foundPost.likes.find(
    (likeUserId) => likeUserId === userId
  );
  if (findIfUserDislikedPost) {
    foundPost.dislikes = foundPost.dislikes.filter(
      (dislikeUserId) => dislikeUserId !== userId
    );
  }
  if (findIfUserLikedPost) {
    foundPost.likes.filter((likeUserId) => likeUserId !== userId);
    return res.status(200).json({ success: true, message: "Like removed" });
  }

  foundPost.likes.push(userId);

  await foundPost.save();

  res.status(200).json({ success: true, message: "Like added successfully" });
}

export async function dislikePostHandler(
  req: AuthMiddlewareRequest,
  res: Response
) {
  const userId = req.userId;
  if (!userId)
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized to add like to post" });
  const userIdObjectId = ObjectId.createFromHexString(userId);
  const foundUser = await UserModel.findOne(userIdObjectId);
  if (!foundUser)
    return res.status(404).json({ success: false, message: "User not found" });

  const postId = req.params.postId;
  const postIdObjectId = ObjectId.createFromHexString(postId);
  const foundPost = await PostModel.findOne(postIdObjectId);
  if (!foundPost)
    return res
      .status(404)
      .json({ success: false, message: "Post not found with such id" });

  const findIfUserLikedPost = foundPost.likes.find(
    (likeUserId) => likeUserId === userId
  );

  const findIfUserDislikedPost = foundPost.dislikes.find(
    (dislikeUserId) => dislikeUserId === userId
  );

  if (findIfUserLikedPost) {
    foundPost.likes = foundPost.likes.filter(
      (likeUserId) => likeUserId !== userId
    );
  }
  if (findIfUserDislikedPost) {
    return res
      .status(400)
      .json({ success: false, message: "Post already disliked by user" });
  }
  foundPost.dislikes.push(userId);

  await foundPost.save();

  res.status(200).json({ success: true, message: "Like added successfully" });
}

export async function getAllCommentsHandler(req: Request, res: Response) {
  const { postId } = req.params;

  const postIdObjectId = ObjectId.createFromHexString(postId);
  const foundPost = await PostModel.findOne(postIdObjectId);

  if (!foundPost)
    return res.status(404).json({ success: false, message: "Post not found" });

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
  if (!userId)
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized to create comment" });
  const userIdObjectId = ObjectId.createFromHexString(userId);
  const foundUser = await UserModel.findOne(userIdObjectId);
  if (!foundUser)
    return res.status(404).json({ success: false, message: "User not found" });

  const { postId } = req.params;

  const postIdObjectId = ObjectId.createFromHexString(postId);
  const foundPost = await PostModel.findOne(postIdObjectId);

  if (!foundPost)
    return res.status(404).json({ success: false, message: "Post not found" });

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
}

export async function editCommentHandler(
  req: AuthMiddlewareRequest,
  res: Response
) {
  const userId = req.userId;
  if (!userId)
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized to create post" });
  const userIdObjectId = ObjectId.createFromHexString(userId);
  const foundUser = await UserModel.findOne(userIdObjectId);
  if (!foundUser)
    return res.status(404).json({ success: false, message: "User not found" });

  const { postId, commentId } = req.params;

  const postIdObjectId = ObjectId.createFromHexString(postId);
  const foundPost = await PostModel.findOne(postIdObjectId);

  if (!foundPost)
    return res.status(404).json({ success: false, message: "Post not found" });

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
}

export async function getAllRepliesHandler(req: Request, res: Response) {
  const { postId, commentId } = req.params;

  const postIdObjectId = ObjectId.createFromHexString(postId);
  const foundPost = await PostModel.findOne(postIdObjectId);

  if (!foundPost)
    return res.status(404).json({ success: false, message: "Post not found" });

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
}

export async function createReplyHandler(
  req: AuthMiddlewareRequest,
  res: Response
) {
  const userId = req.userId;
  const { postId, commentId } = req.params;

  if (!userId)
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized to create comment" });
  const userIdObjectId = ObjectId.createFromHexString(userId);
  const foundUser = await UserModel.findOne(userIdObjectId);
  if (!foundUser)
    return res.status(404).json({ success: false, message: "User not found" });

  const postIdObjectId = ObjectId.createFromHexString(postId);
  const foundPost = await PostModel.findOne(postIdObjectId);

  if (!foundPost)
    return res.status(404).json({ success: false, message: "Post not found" });

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
}

export async function editReplyHandler(
  req: AuthMiddlewareRequest,
  res: Response
) {
  const userId = req.userId;
  if (!userId)
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized to create post" });
  const userIdObjectId = ObjectId.createFromHexString(userId);
  const foundUser = await UserModel.findOne(userIdObjectId);
  if (!foundUser)
    return res.status(404).json({ success: false, message: "User not found" });

  const { postId, commentId, replyId } = req.params;

  const postIdObjectId = ObjectId.createFromHexString(postId);
  const foundPost = await PostModel.findOne(postIdObjectId);

  if (!foundPost)
    return res.status(404).json({ success: false, message: "Post not found" });

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
    return res.status(404).json({ success: false, message: "Reply not found" });

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
}

export async function likeCommentHandler(
  req: AuthMiddlewareRequest,
  res: Response
) {
  const userId = req.userId;
  if (!userId)
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized to create comment" });
  const userIdObjectId = ObjectId.createFromHexString(userId);
  const foundUser = await UserModel.findOne(userIdObjectId);
  if (!foundUser)
    return res.status(404).json({ success: false, message: "User not found" });

  const { postId } = req.params;

  if (!postId)
    return res
      .status(400)
      .json({ success: false, message: "postId not added" });
  const postIdObjectId = ObjectId.createFromHexString(postId);
  const foundPost = await PostModel.findOne(postIdObjectId);

  if (!foundPost)
    return res.status(404).json({ success: false, message: "Post not found" });

  const { commentId } = req.params;
  if (!commentId)
    return res
      .status(400)
      .json({ success: false, message: "commentId not added" });
  const commentIdObjectId = ObjectId.createFromHexString(commentId);

  const foundComment = await CommentModel.findOne(commentIdObjectId);

  if (!foundComment)
    return res
      .status(404)
      .json({ success: false, message: "Comment not found" });

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
  if (!userId)
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized to create comment" });
  const userIdObjectId = ObjectId.createFromHexString(userId);
  const foundUser = await UserModel.findOne(userIdObjectId);
  if (!foundUser)
    return res.status(404).json({ success: false, message: "User not found" });

  const { postId } = req.params;

  if (!postId)
    return res
      .status(400)
      .json({ success: false, message: "postId not added" });
  const postIdObjectId = ObjectId.createFromHexString(postId);
  const foundPost = await PostModel.findOne(postIdObjectId);

  if (!foundPost)
    return res.status(404).json({ success: false, message: "Post not found" });

  const { commentId } = req.params;
  if (!commentId)
    return res
      .status(400)
      .json({ success: false, message: "commentId not added" });
  const commentIdObjectId = ObjectId.createFromHexString(commentId);

  const foundComment = await CommentModel.findOne(commentIdObjectId);

  if (!foundComment)
    return res
      .status(404)
      .json({ success: false, message: "Comment not found" });

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
  if (!userId)
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized to create comment" });
  const userIdObjectId = ObjectId.createFromHexString(userId);
  const foundUser = await UserModel.findOne(userIdObjectId);
  if (!foundUser)
    return res.status(404).json({ success: false, message: "User not found" });

  const { postId } = req.params;

  if (!postId)
    return res
      .status(400)
      .json({ success: false, message: "postId not added" });
  const postIdObjectId = ObjectId.createFromHexString(postId);
  const foundPost = await PostModel.findOne(postIdObjectId);

  if (!foundPost)
    return res.status(404).json({ success: false, message: "Post not found" });

  const { commentId } = req.params;
  if (!commentId)
    return res
      .status(400)
      .json({ success: false, message: "commentId not added" });
  const commentIdObjectId = ObjectId.createFromHexString(commentId);

  const foundComment = await CommentModel.findOne(commentIdObjectId);

  if (!foundComment)
    return res
      .status(404)
      .json({ success: false, message: "Comment not found" });

  const { replyId } = req.params;
  if (!replyId)
    return res
      .status(400)
      .json({ success: false, message: "replyId not added" });

  const replyIdObjectId = ObjectId.createFromHexString(replyId);
  const foundReply = await ReplyModel.findOne(replyIdObjectId);
  if (!foundReply)
    return res
      .status(404)

      .json({ success: false, message: "Reply not found" });

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
  if (!userId)
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized to create comment" });
  const userIdObjectId = ObjectId.createFromHexString(userId);
  const foundUser = await UserModel.findOne(userIdObjectId);
  if (!foundUser)
    return res.status(404).json({ success: false, message: "User not found" });

  const { postId } = req.params;

  if (!postId)
    return res
      .status(400)
      .json({ success: false, message: "postId not added" });
  const postIdObjectId = ObjectId.createFromHexString(postId);
  const foundPost = await PostModel.findOne(postIdObjectId);

  if (!foundPost)
    return res.status(404).json({ success: false, message: "Post not found" });

  const { commentId } = req.params;
  if (!commentId)
    return res
      .status(400)
      .json({ success: false, message: "commentId not added" });
  const commentIdObjectId = ObjectId.createFromHexString(commentId);

  const foundComment = await CommentModel.findOne(commentIdObjectId);

  if (!foundComment)
    return res
      .status(404)
      .json({ success: false, message: "Comment not found" });

  const { replyId } = req.params;
  if (!replyId)
    return res
      .status(400)
      .json({ success: false, message: "replyId not added" });

  const replyIdObjectId = ObjectId.createFromHexString(replyId);
  const foundReply = await ReplyModel.findOne(replyIdObjectId);
  if (!foundReply)
    return res.status(404).json({ success: false, message: "Reply not found" });

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
