import { MONGO_URI } from "../constants/env";
import crypto, { verify } from "crypto";
import path from "path";
import mongoose from "mongoose";
import express from "express";
import Router from "express";
import { Request, Response, NextFunction } from "express";
import { ImageModel } from "../models/image.model";
import multer from "multer";
import { bucket } from "../db/connectDB";
import verifyJWT from "../middleware/verifyJWT";
import {
  deletePostImagesHandler,
  getPostImagesHandler,
  uploadImagesPostHandler,
  uploadProfilePictureHandler,
} from "../controllers/images.controller";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 1024 * 1024 * 10,
  },
});

const imagesRoutes = express.Router();

imagesRoutes.post(
  "/profilePictures",
  verifyJWT as express.RequestHandler,
  upload.single("file"),
  uploadProfilePictureHandler as express.RequestHandler
);

imagesRoutes.post(
  "/postImages",
  verifyJWT as express.RequestHandler,
  upload.array("files"),
  uploadImagesPostHandler as express.RequestHandler
);

imagesRoutes.get("/postImages/:postId", async (req, res) => {
  await getPostImagesHandler(req, res);
});

imagesRoutes.delete("/postImages/:postId", async (req, res) => {
  await deletePostImagesHandler(req, res);
});

export default imagesRoutes;
