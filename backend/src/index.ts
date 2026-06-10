import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { AuthRouter } from "./routes/index";
import cookieParser from "cookie-parser";

const app = express();
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT;
const DB_URL = process.env.MONGODB_URL as string;
const API_VER = process.env.API_VER;

app.use(`/api/${API_VER}/auth`, AuthRouter);

app.get("/", (req, res) => {
  res.send("CURO API. Unauthorized requests are not allowed.");
});

mongoose
  .connect(DB_URL)
  .then(() => {
    console.log("[DB]: Connected to MongoDB");
  })
  .catch((err) => console.error(err));

app.listen(PORT, () => {
  console.log(
    `[LOG]: express server started on port ${PORT} - http://localhost:${PORT}`,
  );
});
