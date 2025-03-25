import Joi from "joi";
import CustomError from "../../../constants/customError";

const userIdSchema = Joi.object({
  userId: Joi.string().hex().length(24).required(),
});
const postIdSchema = Joi.object({
  postId: Joi.string().hex().length(24).required(),
});
const imagesIdsSchema = Joi.object({
  imagesIds: Joi.array().items(Joi.string().hex().length(24)),
});

type ValidatePostRequestType = {
  userId?: unknown;
  postId?: string;
  imagesIds?: unknown;
};
export function validateImagesRoutesRequest({
  userId,
  postId,
  imagesIds,
}: ValidatePostRequestType) {
  if (userId) {
    const { error } = userIdSchema.validate({ userId });
    if (error) throw new CustomError(400, error.details[0].message);
  }
  if (postId) {
    const { error } = postIdSchema.validate({ postId });
    if (error) throw new CustomError(400, error.details[0].message);
  }
  if (imagesIds) {
    const { error } = imagesIdsSchema.validate({ imagesIds });
    if (error) throw new CustomError(400, error.details[0].message);
  }
}
