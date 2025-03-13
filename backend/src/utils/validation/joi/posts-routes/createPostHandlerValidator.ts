import Joi from "joi";
import CustomError from "../../../../constants/customError";

const createPostSchema = Joi.object({
  userId: Joi.string().hex().length(24).required(),
  title: Joi.string().min(2).required(),
  content: Joi.string().allow(null),
  tags: Joi.array().items(Joi.string()),
}).options({ abortEarly: true });

export function validateCreatePostRequest({
  userId,
  title,
  content,
  tags,
}: {
  userId: unknown;
  title: unknown;
  content: unknown;
  tags: unknown;
}) {
  const { error } = createPostSchema.validate({
    userId,
    title,
    content,
    tags,
  });

  if (error) throw new CustomError(400, error.details[0].message);
}
