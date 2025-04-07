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

const newPasswordSchema = Joi.object({
  password: Joi.string()
    .min(7)
    .max(100)
    .pattern(regexAtLeastOneSymbolLetterAndNumber)
    .required(),
});

const loginPasswordSchema = Joi.object({
  password: Joi.string().required(),
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

type ValidateUsersRequestType = {
  userId?: unknown;
  email?: unknown;
  loginPassword?: unknown;
  newPassword?: unknown;
  name?: unknown;
  username?: unknown;
  passedUserId?: boolean;
  passedEmail?: boolean;
  passedLoginPassword?: boolean;
  passedNewPassword?: boolean;
  passedName?: boolean;
  passedUsername?: boolean;
};
export function validateUsersRoutesRequest({
  userId,
  email,
  loginPassword,
  newPassword,
  name,
  username,
  passedUserId,
  passedEmail,
  passedLoginPassword,
  passedNewPassword,
  passedName,
  passedUsername,
}: ValidateUsersRequestType) {
  if (passedUserId) {
    const { error } = userIdSchema.validate({ email });
    if (error) throw new CustomError(400, error.details[0].message);
  }
  if (passedEmail) {
    const { error } = emailSchema.validate({ email });
    if (error) throw new CustomError(400, error.details[0].message);
  }
  if (passedNewPassword) {
    const { error } = newPasswordSchema.validate({ password: newPassword });
    if (error) throw new CustomError(400, error.details[0].message);
  }
  if (passedLoginPassword) {
    const { error } = loginPasswordSchema.validate({ password: loginPassword });
    if (error) throw new CustomError(400, error.details[0].message);
  }
  if (passedName) {
    const { error } = nameSchema.validate({ name });
    if (error) throw new CustomError(400, error.details[0].message);
  }
  if (passedUsername) {
    const { error } = usernameSchema.validate({ username });
    if (error) throw new CustomError(400, error.details[0].message);
  }
}
