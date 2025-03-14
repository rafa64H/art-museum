import Joi from "joi";
import CustomError from "../../../../constants/customError";

const loginSchemaFirstStep = Joi.object({
  emailOrUsername: Joi.string().required(),

  password: Joi.string().required(),
}).options({ abortEarly: true });

export function validateLoginRequest({
  emailOrUsername,
  password,
}: {
  emailOrUsername: unknown;
  password: unknown;
}) {
  const { error } = loginSchemaFirstStep.validate({
    emailOrUsername,
    password,
  });

  if (error) throw new CustomError(400, error.details[0].message);
}
