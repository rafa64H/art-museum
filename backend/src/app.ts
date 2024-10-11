import "dotenv/config";
import express, { urlencoded } from "express";
import { connectDB } from "./db/connectDB";
import { Resend } from "resend";
import authRoutes from "./routes/auth.routes";

const cookieParser = require("cookie-parser");

const app = express();
const resend = new Resend("re_123456789");

const port = 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", async (req, res): Promise<void> => {
  res.send("hellow world");
});

app.use("/api/auth", authRoutes);

app.listen(port, async () => {
  console.log("listening on port", port);
  await connectDB();
});
