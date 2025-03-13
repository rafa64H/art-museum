import Joi from "joi";

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
}): string | null {
  const { error } = loginSchemaFirstStep.validate({
    emailOrUsername,
    password,
  });

  if (error) return error.details[0].message;

  return null;
}
