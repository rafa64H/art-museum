import Joi from "joi";
import CustomError from "../../../../constants/customError";

const createCommentSchema = Joi.object({
  userId: Joi.string().hex().length(24).required(),
  postId: Joi.string().hex().length(24).required(),
  content: Joi.string().max(2000),
});

export function validateCreateCommentRequest({
  userId,
  postId,
  content,
}: {
  userId: unknown;
  postId: string;
  content: unknown;
}) {
  const { error } = createCommentSchema.validate({ userId, postId, content });

  if (error) throw new CustomError(400, error.details[0].message);
}
