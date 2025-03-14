import Joi from "joi";
import CustomError from "../../../../constants/customError";

const getAllRepliesFromCommentSchema = Joi.object({
  postId: Joi.string().hex().length(24).required(),
  commentId: Joi.string().hex().length(24).required(),
});

export function validateGetAllRepliesFromCommentRequest({
  postId,
  commentId,
}: {
  postId: string;
  commentId: string;
}) {
  const { error } = getAllRepliesFromCommentSchema.validate({
    postId,
    commentId,
  });

  if (error) throw new CustomError(400, error.details[0].message);
}
