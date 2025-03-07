import Joi from "joi";

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
}): string | null {
  const { error } = verifyEmailSchema.validate({ code, userId });

  if (error) return error.details[0].message;
  return null;
}
