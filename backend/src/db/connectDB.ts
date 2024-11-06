import mongoose from "mongoose";
import {
  FIREBASE_DATABASE_URL,
  FIREBASE_STORAGE_BUCKET,
  MONGO_URI,
} from "../constants/env";

export const connectDB = async () => {
  try {
    const connect = await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("Error connection to MongoDB: ", error);
    process.exit(1); // 1 is failure, 0 status code is success
  }
};

import * as admin from "firebase-admin";

const serviceAccount = require("./firebaseServiceAccount.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: FIREBASE_DATABASE_URL,
  storageBucket: FIREBASE_STORAGE_BUCKET,
});

export const bucket = admin.storage().bucket();
