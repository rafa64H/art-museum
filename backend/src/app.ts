import "dotenv/config";
import express, { urlencoded } from "express";
import { connectDB } from "./db/connectDB";
import authRoutes from "./routes/auth.routes";
import imagesRoutes from "./routes/images.routes";
import usersRoutes from "./routes/users.routes";
import postsRoutes from "./routes/posts.routes";
import { errorHandler } from "./middleware/errorHandler";
const cors = require("cors");
const cookieParser = require("cookie-parser");

export const app = express();

const port = 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  }),
);

app.use("/auth", authRoutes);

app.use("/api/users", usersRoutes);

app.use("/api/images", imagesRoutes);

app.use("/api/posts", postsRoutes);

app.use(errorHandler);

app.listen(port, async () => {
  console.log("listening on port", port);
  await connectDB();
});
