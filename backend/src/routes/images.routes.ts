import { MONGO_URI } from "../constants/env";
import crypto from "crypto";
import path from "path";
import mongoose from "mongoose";
import express from "express";
import Router from "express";
import { Request, Response, NextFunction } from "express";
import { ImageModel } from "../models/image.model";
import multer from "multer";
import { bucket } from "../db/connectDB";
import verifyJWT from "../middleware/verifyJWT";
import testRoutes from "./test.route";
import { uploadImageHandler } from "../controllers/images.controller";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
});

const imagesRoutes = express.Router();

imagesRoutes.use(verifyJWT as express.RequestHandler);

imagesRoutes.post(
  "/profilePictures",
  upload.single("file"),
  uploadImageHandler as express.RequestHandler
);

export default imagesRoutes;
