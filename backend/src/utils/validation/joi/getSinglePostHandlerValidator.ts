import Joi from "joi";

const getSinglePostSchema = Joi.object({
  postId: Joi.string().hex().length(24).required(),
});

export function validateGetSinlePost({ postId }: { postId: unknown }) {
  const { error } = getSinglePostSchema.validate(postId);

  if (error) return error.details[0].message;

  return null;
}
