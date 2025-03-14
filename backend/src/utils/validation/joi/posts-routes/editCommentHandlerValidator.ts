import Joi from "joi";
import CustomError from "../../../../constants/customError";

const editCommentSchema = Joi.object({
  userId: Joi.string().hex().length(24).required(),
  postId: Joi.string().hex().length(24).required(),
  commentId: Joi.string().hex().length(24).required(),
  content: Joi.string().min(1).max(2000).required(),
});

export function validateEditCommentRequest({
  userId,
  postId,
  commentId,
  content,
}: {
  userId: unknown;
  postId: string;
  commentId: string;
  content: unknown;
}) {
  const { error } = editCommentSchema.validate({
    userId,
    postId,
    commentId,
    content,
  });
  if (error) throw new CustomError(400, error.details[0].message);
}
