import { NextFunction, Request, Response } from "express";
import CustomError from "../constants/customError";

export async function errorHandler(
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (error instanceof CustomError) {
    res
      .status(error.statusCode)
      .json({ success: false, message: error.message });
    return;
  } else {
    res.status(500).json({ success: false, message: "Internal server error" });
    console.log(error);
    return;
  }
}
