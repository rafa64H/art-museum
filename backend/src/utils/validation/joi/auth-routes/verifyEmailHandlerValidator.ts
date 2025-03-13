import Joi from "joi";
import CustomError from "../../../../constants/customError";

const verifyEmailSchema = Joi.object({
  code: Joi.string().required(),
  userId: Joi.string().hex().length(24).required(),
}).options({ abortEarly: true });

export function validateVerifyEmailRequest({
  code,
  userId,
}: {
  code: unknown;
  userId: unknown;
}) {
  const { error } = verifyEmailSchema.validate({ code, userId });

  if (error) throw new CustomError(400, error.details[0].message);
}
