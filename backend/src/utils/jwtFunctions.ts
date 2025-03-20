import jwt, { JwtPayload, VerifyOptions } from "jsonwebtoken";
import { JWT_SECRET_ACCESS, JWT_SECRET_REFRESH } from "../constants/env";

export function createAccessToken({
  userId,
  role,
}: {
  userId: string;
  role: string;
}) {
  const accessToken = jwt.sign({ userId, role }, JWT_SECRET_ACCESS, {
    expiresIn: "15m",
  });
  return accessToken;
}

export function createRefreshToken({
  userId,
  role,
}: {
  userId: string;
  role: string;
}) {
  const refreshToken = jwt.sign({ userId, role }, JWT_SECRET_REFRESH, {
    expiresIn: "30d",
  });

  return refreshToken;
}
