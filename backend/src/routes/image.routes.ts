import { MONGO_URI } from "../constants/env";
import crypto from "crypto";
import path from "path";
import mongoose from "mongoose";
import express from "express";
import Router from "express";
import { Request, Response, NextFunction } from "express";
import { ImageModel } from "../models/image.model";
import multer from "multer";
import ErrorReturn from "../constants/ErrorReturn";
import { bucket } from "../db/connectDB";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
});

const imagesRoutes = express.Router();

imagesRoutes.post(
  "/profilePictures",
  upload.single("file"),
  async (req: Request, res: Response) => {
    try {
      console.log(req.file);
      const userId = "1234567user";
      const file = req.file;

      if (!file) {
        throw new ErrorReturn(400, "no file provided");
      }

      const filename = file.originalname;
      const fileRef = bucket.file(`usersProfilePicture/${userId}/${filename}`);
      const stream = fileRef.createWriteStream({
        metadata: {
          contentType: file.mimetype, // Set the content type for the image
        },
      });

      // Pipe the uploaded file to the write stream

      stream.on("error", (err) => {
        console.error("Error uploading file:", err);

        res.status(500).send("Error uploading file");
      });

      stream.on("finish", () => {
        // File uploaded successfully

        console.log(`File uploaded successfully: ${fileRef.name}`);

        res.status(200).send("File uploaded successfully");
      });

      stream.end(file.buffer); // Write the file buffer to the stream
    } catch (error) {
      const isErrorReturn = error instanceof ErrorReturn;
      console.log(error);

      res.status(isErrorReturn ? error.status : 500).json({
        success: false,
        message: isErrorReturn ? error.message : error,
      });
    }
  }
);

export default imagesRoutes;
