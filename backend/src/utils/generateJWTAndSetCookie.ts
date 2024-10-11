import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../constants/env";
import { Response } from "express";
import { ObjectId } from "mongodb";

export const generateTokenAndSetCookie = (res: Response, userId: ObjectId) => {
  const token = jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return token;
};
