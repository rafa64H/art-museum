import jwt, { JwtPayload, VerifyOptions } from "jsonwebtoken";
import {
  JWT_SECRET_ACCESS,
  JWT_SECRET_REFRESH,
  NODE_ENV,
} from "../constants/env";
import { CookieOptions, Response } from "express";
import { ObjectId } from "mongodb";

export interface RefreshTokenPayload extends JwtPayload {
  userId: ObjectId;
  role: "user" | "admin";
}
export interface AccessTokenPayload extends JwtPayload {
  userId: ObjectId;
  role: "user" | "admin";
}

export const verifyToken = <TPayload extends object = AccessTokenPayload>(
  token: string,
  secret: string,
  options?: VerifyOptions & {
    secret?: string;
  }
) => {
  const payload = jwt.verify(token, secret) as TPayload;
  return {
    payload,
  };
};
