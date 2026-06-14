import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { AuthRouter, UnifiedEventRouter } from "./routes/index";
import cookieParser from "cookie-parser";
import { FRONTEND_URL, PORT, MONGODB_URL, API_VER } from "./config/env";
import { errorHandler } from "./middlewares";

const app = express();

app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.use(`/api/${API_VER}/auth`, AuthRouter);
app.use(`/api/${API_VER}/unified`, UnifiedEventRouter);

app.get("/", (_req, res) => {
  res.send("CURO API. Unauthorized requests are not allowed.");
});

app.use(errorHandler);

mongoose
  .connect(MONGODB_URL as string)
  .then(() => {
    console.log("[DB]: Connected to MongoDB");
  })
  .catch((err) => {
    console.error("[DB]: Failed to connect to MongoDB", err);
    process.exit(1);
  });

app.listen(PORT, () => {
  console.log(
    `[LOG]: express server started on port ${PORT} - http://localhost:${PORT}`,
  );
});

process.on("uncaughtException", (err) => {
  console.error("[FATAL]: Uncaught exception", err);
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  console.error("[FATAL]: Unhandled rejection", reason);
  process.exit(1);
});
