import "dotenv/config";
import express, { urlencoded } from "express";
import { connectDB } from "./db/connectDB";
const cookieParser = require("cookie-parser");

const app = express();

const port = 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.listen(port, async () => {
  console.log("listening on port", port);
  await connectDB();
});
