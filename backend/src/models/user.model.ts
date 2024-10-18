import mongoose from "mongoose";

export interface UserDocument extends mongoose.Document {
  email: string;
  name: string;
  username: string;
  password: string;
  verified: boolean;
  lastLogin: Date;
  createdAt: Date;
  lastUpdated: Date;
  resetPasswordToken: String | undefined;
  resetPasswordExpiresAt: Date | undefined;
  verificationToken: String | undefined;
  verificationTokenExpiresAt: Date | undefined;
}

const UserSchema = new mongoose.Schema<UserDocument>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    resetPasswordToken: String || undefined,
    resetPasswordExpiresAt: Date || undefined,
    verificationToken: String || undefined,
    verificationTokenExpiresAt: Date || undefined,
  },
  { timestamps: true }
);

export const UserModel = mongoose.model("User", UserSchema);
