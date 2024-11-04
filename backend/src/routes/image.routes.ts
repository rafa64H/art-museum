import multer from "multer";
const methodOverride = require("method-override");
import { GridFsStorage } from "multer-gridfs-storage";
import { MONGO_URI } from "../constants/env";
import crypto from "crypto";
import path from "path";
import mongoose from "mongoose";
import { connect } from "http2";
import { GridFSBucket } from "mongodb";
import express from "express";
import Router from "express";
import { Request, Response, NextFunction } from "express";
import { ImageModel } from "../models/image.model";

const imageRoutes = express.Router();

const connection = mongoose.createConnection(MONGO_URI);

let gfs: GridFSBucket;

connection.once("open", () => {
  gfs = new mongoose.mongo.GridFSBucket(connection.db!, {
    bucketName: "images",
  });
  console.log("GridFS Bucket is ready");
});

const storage = new GridFsStorage({
  url: MONGO_URI,
  file: (req: Request, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) return reject(err);

        const filename = buf.toString("hex") + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: "images",
        };
        resolve(fileInfo);
      });
    });
  },
});

const upload = multer({ storage });

imageRoutes.post(
  "/",
  upload.single("file"),
  async (req: Request, res: Response) => {
    console.log(req.body);
    try {
      const caption: string = req.body.caption;
      const filename: string = req.body.file.filename;
      const fileId: string = req.body.file.id;
      if (!caption) throw new Error("No caption");

      const foundImage = await ImageModel.findOne({
        caption: req.body.caption,
      });
      if (foundImage) throw new Error("Image already exists");

      let newImage = new ImageModel({
        caption: caption,
        filename: filename,
        fileId: fileId,
      });

      await newImage.save();
    } catch (error) {
      res.json(error);
    }
  }
);

imageRoutes.get("/", async (req: Request, res: Response) => {
  try {
    const array = await gfs.find().toArray();

    if (!array || array.length === 0) {
      throw new Error("No files available");
    }

    gfs.openDownloadStream(array[0]._id).pipe(res);

    res.status(200).json({
      success: true,
      files: array,
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

export default imageRoutes;
