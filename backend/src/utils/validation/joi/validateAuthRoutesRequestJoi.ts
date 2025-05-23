import Joi from "joi";
import {
  regexAtLeastOneSymbolLetterAndNumber,
  regexAtLeastThreeCharacters,
} from "./regularExpressions";
import CustomError from "../../../constants/customError";

const userIdSchema = Joi.object({
  userId: Joi.string().hex().length(24).required(),
});
const emailSchema = Joi.object({
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  }),
}).required();

const passwordSchema = Joi.object({
  password: Joi.string()
    .min(7)
    .max(100)
    .pattern(regexAtLeastOneSymbolLetterAndNumber)
    .required(),
});

const confirmPasswordSchema = Joi.object({
  confirmPassword: Joi.string().required(),
});

const nameSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(50)
    .pattern(regexAtLeastThreeCharacters)
    .required(),
});

const usernameSchema = Joi.object({
  username: Joi.string().min(3).alphanum().required(),
});

const emailOrUsernameSchema = Joi.object({
  emailOrUsername: Joi.string().required(),
});

const loginSchema = Joi.object({
  emailOrUsername: Joi.string().required(),

  password: Joi.string().required(),
}).options({ abortEarly: true });

const verifyEmailOrResetPasswordSchema = Joi.object({
  code: Joi.string().required(),
  userId: Joi.string().hex().length(24).required(),
}).options({ abortEarly: true });

type ValidateAuthRequestType = {
  userId?: unknown;
  email?: unknown;
  password?: unknown;
  confirmPassword?: unknown;
  name?: unknown;
  username?: unknown;
  emailOrUsername?: unknown;
  loginObject?: {
    emailOrUsername: unknown;
    password: unknown;
  };
  verifyEmailOrResetPasswordObject?: {
    code: unknown;
    userId: unknown;
  };
  passedUserId?: boolean;
  passedEmail?: boolean;
  passedPassword?: boolean;
  passedConfirmPassword?: boolean;
  passedName?: boolean;
  passedUsername?: boolean;
  passedEmailOrUsername?: boolean;
  passedLoginObject?: boolean;
  passedVerifyEmailOrResetPasswordObject?: boolean;
};
export function validateAuthRoutesRequest({
  userId,
  email,
  password,
  confirmPassword,
  name,
  username,
  emailOrUsername,
  loginObject,
  verifyEmailOrResetPasswordObject,
  passedUserId,
  passedEmail,
  passedPassword,
  passedConfirmPassword,
  passedName,
  passedUsername,
  passedEmailOrUsername,
  passedLoginObject,
  passedVerifyEmailOrResetPasswordObject,
}: ValidateAuthRequestType) {
  if (passedUserId) {
    const { error } = userIdSchema.validate({ userId });
    if (error) throw new CustomError(400, error.details[0].message);
  }
  if (passedEmail) {
    const { error } = emailSchema.validate({ email });
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
    const { error } = confirmPasswordSchema.validate({ confirmPassword });
    if (error) throw new CustomError(400, error.details[0].message);
  }
  if (passedPassword && passedConfirmPassword) {
    if (password !== confirmPassword)
      throw new CustomError(400, "Password and confirm password do not match");
  }
  if (passedName) {
    const { error } = nameSchema.validate({ name });
    if (error) throw new CustomError(400, error.details[0].message);
  }
  if (passedUsername) {
    const { error } = usernameSchema.validate({ username });
    if (error) throw new CustomError(400, error.details[0].message);
  }
  if (passedEmailOrUsername) {
    const { error } = emailOrUsernameSchema.validate({ emailOrUsername });
    if (error) throw new CustomError(400, error.details[0].message);
  }
  if (passedLoginObject) {
    const { error } = loginSchema.validate(loginObject);
    if (error) throw new CustomError(400, error.details[0].message);
  }
  if (passedVerifyEmailOrResetPasswordObject) {
    const { error } = verifyEmailOrResetPasswordSchema.validate(
      verifyEmailOrResetPasswordObject
    );
    if (error) throw new CustomError(400, error.details[0].message);
  }
}
