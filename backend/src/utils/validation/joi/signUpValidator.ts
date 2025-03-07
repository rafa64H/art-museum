import Joi from "joi";
import {
  regexAtLeastOneSymbolLetterAndNumber,
  regexAtLeastThreeCharacters,
} from "./regularExpressions";

const signUpSchema = Joi.object({
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  }),
  password: Joi.string()
    .min(7)
    .max(100)
    .pattern(regexAtLeastOneSymbolLetterAndNumber),
  name: Joi.string().min(3).max(50).pattern(regexAtLeastThreeCharacters),
  username: Joi.string().min(3).alphanum(),
}).options({ abortEarly: true });

export function validateSignUpRequest({
  email,
  password,
  name,
  username,
}: {
  email: string;
  password: string;
  name: string;
  username: string;
}): string | null {
  let usernameWithoutSpaces = "";
  if (typeof username === "string")
    usernameWithoutSpaces = username.replace(/\s/g, "");

  const { error } = signUpSchema.validate({
    email,
    password,
    name,
    usernameWithoutSpaces,
  });

  if (error) {
    if (
      error.details[0].message.includes("password") &&
      error.details[0].message.includes("pattern")
    ) {
      return "Password must contain at least one symbol, one letter, and one number";
    }
    return error.details[0].message;
  }
  return null;
}
