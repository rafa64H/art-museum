import "dotenv/config";
import express, { urlencoded } from "express";
import { connectDB } from "./db/connectDB";
import authRoutes from "./routes/auth.routes";
import testRoutes from "./routes/test.route";
import imagesRoutes from "./routes/images.routes";
import accountRoutes from "./routes/account.routes";
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

const port = 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use("/auth", authRoutes);

app.use("/account", accountRoutes);

app.use("/api/images", imagesRoutes);

app.use("/api/test", testRoutes);

app.listen(port, async () => {
  console.log("listening on port", port);
  await connectDB();
});
