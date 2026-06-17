import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { AuthRouter } from "./routes/index";
import cookieParser from "cookie-parser";
import { FRONTEND_URL, PORT, MONGODB_URL, API_VER } from "./config/env";

const app = express();
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

const DB_URL = MONGODB_URL as string;

app.use(`/api/${API_VER}/auth`, AuthRouter);

app.get("/", (req, res) => {
  res.send("CURO Secrets Management API. Unauthorized requests are not allowed.");
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
