import Joi from "joi";

const forgotPasswordSchema = Joi.object({
  emailOrUsername: Joi.string().required(),
});

export function validateForgotPasswordRequest({
  emailOrUsername,
}: {
  emailOrUsername: unknown;
}): string | null {
  const { error } = forgotPasswordSchema.validate({ emailOrUsername });
  if (error) return error.details[0].message;

  return null;
}
