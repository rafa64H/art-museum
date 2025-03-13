import Joi from "joi";
import CustomError from "../../../../constants/customError";

const getSinglePostSchema = Joi.object({
  postId: Joi.string().hex().length(24).required(),
});

export function validateGetSinlePostRequest({ postId }: { postId: string }) {
  const { error } = getSinglePostSchema.validate(postId);

  if (error) throw new CustomError(400, error.details[0].message);
}
