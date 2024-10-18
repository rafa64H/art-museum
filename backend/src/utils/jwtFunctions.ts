import jwt, { JwtPayload, VerifyOptions } from "jsonwebtoken";
import { JWT_SECRET, NODE_ENV } from "../constants/env";
import { CookieOptions, Response } from "express";
import { ObjectId } from "mongodb";
import { fifteenMinutesFromNow, thirtyDaysFromNow } from "./date";

const secure = NODE_ENV !== "development";

const defaults: CookieOptions = {
  sameSite: "strict",
  httpOnly: true,
  secure,
};

export interface RefreshTokenPayload extends JwtPayload {
  userId: ObjectId;
  sessionId: ObjectId;
}
export interface AccessTokenPayload extends JwtPayload {
  userId: ObjectId;
  sessionId: ObjectId;
}

export const generateJWTTokensAndSetCookies = (
  res: Response,
  userId: ObjectId,
  sessionId: ObjectId
) => {
  const fifteenMinutes = fifteenMinutesFromNow();
  const thirtyDays = thirtyDaysFromNow();

  const accessToken = jwt.sign({ userId, sessionId }, JWT_SECRET, {
    expiresIn: "15m",
  });

  res.cookie("accessToken", accessToken, {
    ...defaults,
    maxAge: fifteenMinutes.getDate(),
  });

  const refreshToken = jwt.sign({ userId, sessionId }, JWT_SECRET, {
    expiresIn: "30d",
  });

  res.cookie("refreshToken", refreshToken, {
    ...defaults,
    maxAge: thirtyDays.getDate(),
  });

  return { accessToken, refreshToken };
};

export const verifyToken = <TPayload extends object = AccessTokenPayload>(
  token: string,
  options?: VerifyOptions & {
    secret?: string;
  }
) => {
  const payload = jwt.verify(token, JWT_SECRET, {
    ...defaults,
  }) as TPayload;
  return {
    payload,
  };
};
