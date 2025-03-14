import Joi from "joi";
import CustomError from "../../../../constants/customError";

const getAllCommentsSchema = Joi.object({
  postId: Joi.string().hex().length(24).required(),
});

export function validateGetAllCommentsRequest({ postId }: { postId: string }) {
  const { error } = getAllCommentsSchema.validate({ postId });
  if (error) throw new CustomError(400, error.details[0].message);
}
