import Joi from "joi";
import CustomError from "../../../constants/customError";

const userIdSchema = Joi.object({
  userId: Joi.string().hex().length(24).required(),
});
const postTitleSchema = Joi.object({
  title: Joi.string().min(2).required(),
});
const postIdSchema = Joi.object({
  postId: Joi.string().hex().length(24).required(),
});
const postContentSchema = Joi.object({
  content: Joi.string().allow(null),
});
const postTagsSchema = Joi.object({
  tags: Joi.array().items(Joi.string()),
});
const postAmountOfImagesSchema = Joi.object({
  amountOfImages: Joi.array().items(Joi.number()),
});
const commentIdSchema = Joi.object({
  commentId: Joi.string().hex().length(24).required(),
});
const replyIdSchema = Joi.object({
  replyId: Joi.string().hex().length(24).required(),
});
const contentCommentOrReplySchema = Joi.object({
  content: Joi.string().min(1).max(2000).required(),
});

type ValidatePostRequestType = {
  userId?: unknown;
  postTitle?: unknown;
  postContent?: unknown;
  postTags?: unknown;
  postAmountOfImages?: unknown;
  postId?: string;
  commentId?: string;
  replyId?: string;
  contentCommentOrReply?: unknown;
};
export function validatePostsRoutesRequest({
  userId,
  postTitle,
  postContent,
  postTags,
  postAmountOfImages,
  postId,
  commentId,
  replyId,
  contentCommentOrReply,
}: ValidatePostRequestType) {
  if (userId) {
    const { error } = userIdSchema.validate({ userId });
    if (error) throw new CustomError(400, error.details[0].message);
  }
  if (postTitle) {
    const { error } = postTitleSchema.validate({ title: postTitle });
    if (error) throw new CustomError(400, error.details[0].message);
  }
  if (postContent) {
    const { error } = postContentSchema.validate({ content: postContent });
    if (error) throw new CustomError(400, error.details[0].message);
  }
  if (postTags) {
    const { error } = postTagsSchema.validate({ tags: postTags });
    if (error) throw new CustomError(400, error.details[0].message);
  }
  if (postAmountOfImages) {
    const { error } = postAmountOfImagesSchema.validate({
      amountOfImages: postAmountOfImages,
    });
    if (error) throw new CustomError(400, error.details[0].message);
  }
  if (postId) {
    const { error } = postIdSchema.validate({ postId });
    if (error) throw new CustomError(400, error.details[0].message);
  }
  if (commentId) {
    const { error } = commentIdSchema.validate({ commentId });
    if (error) throw new CustomError(400, error.details[0].message);
  }
  if (replyId) {
    const { error } = replyIdSchema.validate({ replyId });
    if (error) throw new CustomError(400, error.details[0].message);
  }
  if (contentCommentOrReply) {
    const { error } = contentCommentOrReplySchema.validate({
      content: contentCommentOrReply,
    });
    if (error) throw new CustomError(400, error.details[0].message);
  }
}
