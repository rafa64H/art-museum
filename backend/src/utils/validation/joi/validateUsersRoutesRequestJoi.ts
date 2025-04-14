import Joi from "joi";
import {
  regexAtLeastOneSymbolLetterAndNumber,
  regexAtLeastThreeCharacters,
} from "./regularExpressions";
import CustomError from "../../../constants/customError";
import checkOrRemoveIfUsernameHasAt from "../../checkOrRemoveIfUsernameHasAt";

const userIdSchema = Joi.object({
  userId: Joi.string().hex().length(24).required(),
});
const emailSchema = Joi.object({
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    })
    .required(),
});

const usernameSchema = Joi.object({
  username: Joi.string().min(3).alphanum().required(),
});

const nameSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(50)
    .pattern(regexAtLeastThreeCharacters)
    .required(),
});

const passwordSchema = Joi.object({
  password: Joi.string()
    .min(7)
    .max(100)
    .pattern(regexAtLeastOneSymbolLetterAndNumber)
    .required(),
});

const passwordIsStringSchema = Joi.object({
  password: Joi.string().required(),
});

type ValidateUserRequestType = {
  userId?: unknown;
  email?: unknown;
  username?: unknown;
  name?: unknown;
  password?: unknown;
  confirmPassword?: unknown;
  loginPassword?: unknown;
  passedUserId?: boolean;
  passedEmail?: boolean;
  passedUsername?: boolean;
  passedName?: boolean;
  passedPassword?: boolean;
  passedConfirmPassword?: boolean;
  passedLoginPassword?: boolean;
};

export function validateUsersRoutesRequest({
  userId,
  email,
  username,
  name,
  password,
  confirmPassword,
  loginPassword,
  passedUserId,
  passedEmail,
  passedUsername,
  passedName,
  passedPassword,
  passedConfirmPassword,
  passedLoginPassword,
}: ValidateUserRequestType) {
  if (passedUserId) {
    const { error } = userIdSchema.validate({ userId });
    if (error) throw new CustomError(400, error.details[0].message);
  }
  if (passedEmail) {
    const { error } = emailSchema.validate({ email });
    if (error) throw new CustomError(400, error.details[0].message);
  }

  if (passedUsername) {
    const { error: firstUsernameError } = usernameSchema.validate({ username });

    if (
      firstUsernameError &&
      firstUsernameError.details[0].message.includes("alpha-numeric")
    ) {
      const assertionUsername = username as string;
      const possibleValidUsername =
        checkOrRemoveIfUsernameHasAt(assertionUsername);
      console.log(possibleValidUsername);
      const { error: secondUsernameError } = usernameSchema.validate({
        username: possibleValidUsername,
      });

      if (secondUsernameError)
        throw new CustomError(400, secondUsernameError.details[0].message);
    } else if (firstUsernameError) {
      throw new CustomError(400, firstUsernameError.details[0].message);
    }
  }

  if (passedName) {
    const { error } = nameSchema.validate({ name });
    if (error) throw new CustomError(400, error.details[0].message);
  }
  if (passedPassword) {
    const { error } = passwordSchema.validate({ password });
    if (error)
      throw new CustomError(
        400,
        "Password needs to be 7 characters long, have a letter, a number and a symbol"
      );
  }
  if (passedConfirmPassword) {
    const { error } = passwordIsStringSchema.validate({
      password: confirmPassword,
    });
    if (error) throw new CustomError(400, error.details[0].message);
  }
  if (passedPassword && passedConfirmPassword) {
    if (password !== confirmPassword)
      throw new CustomError(400, "Password and confirm password do not match");
  }
  if (passedLoginPassword) {
    const { error } = passwordIsStringSchema.validate({
      password: loginPassword,
    });
    if (error) throw new CustomError(400, error.details[0].message);
  }
}
