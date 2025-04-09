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
    console.log("hola1");
    const { error } = userIdSchema.validate({ userId });
    if (error) throw new CustomError(400, error.details[0].message);
  }
  if (passedEmail) {
    console.log("hola2");

    const { error } = emailSchema.validate({ email });
    if (error) throw new CustomError(400, error.details[0].message);
  }
  if (passedUsername) {
    console.log("hola3");
    const { error } = usernameSchema.validate({ username });
    if (error) throw new CustomError(400, error.details[0].message);
  }
  if (passedName) {
    console.log("hola4");
    const { error } = nameSchema.validate({ name });
    if (error) throw new CustomError(400, error.details[0].message);
  }
  if (passedPassword) {
    console.log("hola5");
    const { error } = passwordSchema.validate({ password });
    if (error)
      throw new CustomError(
        400,
        "Password needs to be 7 characters long, have a letter, a number and a symbol"
      );
  }
  if (passedConfirmPassword) {
    console.log("hola6");
    const { error } = passwordIsStringSchema.validate({
      password: confirmPassword,
    });
    if (error) throw new CustomError(400, error.details[0].message);
  }
  if (passedPassword && passedConfirmPassword) {
    console.log("hola7");
    if (password !== confirmPassword)
      throw new CustomError(400, "Password and confirm password do not match");
  }
  if (passedLoginPassword) {
    console.log("hola8");
    const { error } = passwordIsStringSchema.validate({
      password: loginPassword,
    });
    if (error) throw new CustomError(400, error.details[0].message);
  }
}
