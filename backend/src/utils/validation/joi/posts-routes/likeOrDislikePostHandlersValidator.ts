import Joi from "joi";
import CustomError from "../../../../constants/customError";

const likeOrDislikeSchema = Joi.object({
  postId: Joi.string().hex().length(24).required(),
  userId: Joi.string().hex().length(24).required(),
});

export function validateLikeOrDislikePostRequest({
  postId,
  userId,
}: {
  postId: string;
  userId: unknown;
}) {
  const { error } = likeOrDislikeSchema.validate({ postId, userId });
  if (error) throw new CustomError(400, error.details[0].message);
}
