import { NextFunction, Request, Response } from "express";
import jwt, { TokenExpiredError } from "jsonwebtoken";
import ErrorReturn from "../constants/ErrorReturn";
import { JWT_SECRET_ACCESS } from "../constants/env";
import { verifyToken } from "../utils/jwtFunctions";
import { ObjectId } from "mongodb";
import { refreshHandler } from "../controllers/auth.controller";

export interface middlewareAuthRequest extends Request {
  userId: ObjectId;
  role: "user" | "admin";
}

const verifyJWT = async (
  req: middlewareAuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader =
      req.headers.authorization || (req.headers.Authorization as string);

    if (!authHeader?.startsWith("Bearer "))
      throw new ErrorReturn(401, "Unauthorized");

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, JWT_SECRET_ACCESS);

    if (typeof decoded !== "object") throw new ErrorReturn(401, "Unauthorized");

    req.userId = decoded.userId;
    req.role = decoded.role;
    next();
  } catch (error) {
    const isErrorReturn = error instanceof ErrorReturn;
    console.log(error);

    res
      .status(isErrorReturn ? error.status : 500)
      .json({ success: false, message: isErrorReturn ? error.message : error });
  }
};
export default verifyJWT;
