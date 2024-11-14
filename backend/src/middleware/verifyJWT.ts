import { NextFunction, Request, RequestHandler, Response } from "express";
import jwt, { TokenExpiredError } from "jsonwebtoken";
import { JWT_SECRET_ACCESS } from "../constants/env";
import { verifyToken } from "../utils/jwtFunctions";
import { ObjectId } from "mongodb";
import { refreshHandler } from "../controllers/auth.controller";

export interface AuthMiddlewareRequest extends Request {
  userId?: string;
  role?: string;
}

const verifyJWT = async (
  req: AuthMiddlewareRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader =
      req.headers.authorization || (req.headers.Authorization as string);

    if (!authHeader)
      return res.status(401).json({ success: false, message: "Unauhtorized" });
    if (!authHeader?.startsWith("Bearer "))
      return res.status(401).json({ success: false, message: "Unauhtorized" });

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, JWT_SECRET_ACCESS);

    if (typeof decoded !== "object")
      return res.status(401).json({ success: false, message: "Unauhtorized" });

    req.userId = decoded.userId;
    req.role = decoded.role;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      await refreshHandler(req, res);
      next();
    }

    console.log(error);

    res.status(500).json({ success: false, message: error });
  }
};
export default verifyJWT;
