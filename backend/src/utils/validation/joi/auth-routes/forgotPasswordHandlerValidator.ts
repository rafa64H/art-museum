import Joi from "joi";
import CustomError from "../../../../constants/customError";

const forgotPasswordSchema = Joi.object({
  emailOrUsername: Joi.string().required(),
});

export function validateForgotPasswordRequest({
  emailOrUsername,
}: {
  emailOrUsername: unknown;
}) {
  const { error } = forgotPasswordSchema.validate({ emailOrUsername });
  if (error) throw new CustomError(400, error.details[0].message);
}
