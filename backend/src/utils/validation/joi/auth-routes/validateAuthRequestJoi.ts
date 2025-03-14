import Joi from "joi";
import {
  regexAtLeastOneSymbolLetterAndNumber,
  regexAtLeastThreeCharacters,
} from "../regularExpressions";
import CustomError from "../../../../constants/customError";

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

const verifyEmailSchema = Joi.object({
  code: Joi.string().required(),
  userId: Joi.string().hex().length(24).required(),
}).options({ abortEarly: true });

type ValidateAuthRequestType = {
  email?: unknown;
  password?: unknown;
  name?: unknown;
  username?: unknown;
  emailOrUsername?: unknown;
  loginObject?: {
    emailOrUsername: unknown;
    password: unknown;
  };
  verifyEmailObject?: {
    code: unknown;
    userId: unknown;
  };
};
export function validateAuthRequest({
  email,
  password,
  name,
  username,
  emailOrUsername,
  loginObject,
  verifyEmailObject,
}: ValidateAuthRequestType) {
  if (email) {
    const { error } = emailSchema.validate({ email });
    if (error) throw new CustomError(400, error.details[0].message);
  }
  if (password) {
    const { error } = passwordSchema.validate({ password });
    if (error) throw new CustomError(400, error.details[0].message);
  }
  if (name) {
    const { error } = nameSchema.validate({ name });
    if (error) throw new CustomError(400, error.details[0].message);
  }
  if (username) {
    const { error } = usernameSchema.validate({ username });
    if (error) throw new CustomError(400, error.details[0].message);
  }
  if (emailOrUsername) {
    const { error } = emailOrUsernameSchema.validate({ emailOrUsername });
    if (error) throw new CustomError(400, error.details[0].message);
  }
  if (loginObject) {
    const { error } = loginSchema.validate(loginObject);
    if (error) throw new CustomError(400, error.details[0].message);
  }
  if (verifyEmailObject) {
    const { error } = verifyEmailSchema.validate(loginObject);
    if (error) throw new CustomError(400, error.details[0].message);
  }
}
