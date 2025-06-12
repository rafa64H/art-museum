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
  content: Joi.string(),
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
const queryParamSchema = Joi.object({
  queryParam: Joi.string().min(1).required(),
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
  queryParam?: unknown;
  passedUserId?: boolean;
  passedPostTitle?: boolean;
  passedContent?: boolean;
  passedTags?: boolean;
  passedAmountOfImages?: boolean;
  passedPostId?: boolean;
  passedCommentId?: boolean;
  passedReplyId?: boolean;
  passedContentCommentOrReply?: boolean;
  passedQueryParam?: boolean;
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
  queryParam,
  passedUserId,
  passedPostTitle,
  passedContent,
  passedTags,
  passedAmountOfImages,
  passedPostId,
  passedCommentId,
  passedReplyId,
  passedContentCommentOrReply,
  passedQueryParam,
}: ValidatePostRequestType) {
  if (passedUserId) {
    const { error } = userIdSchema.validate({ userId });
    if (error) throw new CustomError(400, error.details[0].message);
  }
  if (passedPostTitle) {
    const { error } = postTitleSchema.validate({ title: postTitle });
    if (error) throw new CustomError(400, error.details[0].message);
  }
  if (passedContent) {
    const { error } = postContentSchema.validate({ content: postContent });
    if (error) throw new CustomError(400, error.details[0].message);
  }
  if (passedTags) {
    const { error } = postTagsSchema.validate({ tags: postTags });
    if (error) throw new CustomError(400, error.details[0].message);
  }
  if (passedAmountOfImages) {
    const { error } = postAmountOfImagesSchema.validate({
      amountOfImages: postAmountOfImages,
    });
    if (error) throw new CustomError(400, error.details[0].message);
  }
  if (passedPostId) {
    const { error } = postIdSchema.validate({ postId });
    if (error) throw new CustomError(400, error.details[0].message);
  }
  if (passedCommentId) {
    const { error } = commentIdSchema.validate({ commentId });
    if (error) throw new CustomError(400, error.details[0].message);
  }
  if (passedReplyId) {
    const { error } = replyIdSchema.validate({ replyId });
    if (error) throw new CustomError(400, error.details[0].message);
  }
  if (passedContentCommentOrReply) {
    const { error } = contentCommentOrReplySchema.validate({
      content: contentCommentOrReply,
    });
    if (error) throw new CustomError(400, error.details[0].message);
  }
  if (passedQueryParam) {
    const { error } = queryParamSchema.validate({
      queryParam: queryParam,
    });
    if (error) throw new CustomError(400, error.details[0].message);
  }
}
