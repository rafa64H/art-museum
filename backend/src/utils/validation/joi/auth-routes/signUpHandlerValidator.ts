import Joi from "joi";
import {
  regexAtLeastOneSymbolLetterAndNumber,
  regexAtLeastThreeCharacters,
} from "../regularExpressions";
import CustomError from "../../../../constants/customError";

const signUpSchema = Joi.object({
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    })
    .required(),
  password: Joi.string()
    .min(7)
    .max(100)
    .pattern(regexAtLeastOneSymbolLetterAndNumber)
    .required(),
  name: Joi.string()
    .min(3)
    .max(50)
    .pattern(regexAtLeastThreeCharacters)
    .required(),
  username: Joi.string().min(3).alphanum().required(),
}).options({ abortEarly: true });

export function validateSignUpRequest({
  email,
  password,
  name,
  username,
}: {
  email: unknown;
  password: unknown;
  name: unknown;
  username: unknown;
}) {
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
      throw new CustomError(
        400,
        "Password must contain at least one symbol, one letter, and one number"
      );
    }
    throw new CustomError(400, error.details[0].message);
  }
}
