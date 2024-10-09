import mongoose from "mongoose";
import { MONGO_URI } from "../constants/env";

export const connectDB = async () => {
  try {
    const connect = await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("Error connection to MongoDB: ", error);
    process.exit(1); // 1 is failure, 0 status code is success
  }
};
