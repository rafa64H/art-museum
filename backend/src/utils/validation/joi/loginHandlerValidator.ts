import Joi from "joi";
import { regexAtLeastOneSymbolLetterAndNumber } from "./regularExpressions";

const loginSchemaFirstStep = Joi.object({
  emailOrUsername: Joi.string(),

  password: Joi.string(),
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
