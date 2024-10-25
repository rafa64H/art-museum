import { Request, Response } from "express";

export const getTest = async (req: Request, res: Response) => {
  res.json({ message: "This is a test route" });
};
