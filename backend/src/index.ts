import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { AuthRouter, ProjectRouter, TeamRouter } from "./routes/index";
import cookieParser from "cookie-parser";
import { FRONTEND_URL, PORT, MONGODB_URL, API_VER } from "./config/env";

const app = express();

const allowedOrigins = FRONTEND_URL?.split(",").map((s) => s.trim()).filter(Boolean) || [];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn(`[CORS] Blocked origin: ${origin}`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    maxAge: 86400,
  }),
);
app.use(express.json());
app.use(cookieParser());

const DB_URL = MONGODB_URL as string;

app.use(`/api/${API_VER}/auth`, AuthRouter);
app.use(`/api/${API_VER}/projects`, ProjectRouter);

app.use(`/api/${API_VER}/teams`, TeamRouter);

app.get("/", (req, res) => {
  res.send(
    "CURO Secrets Management API. Unauthorized requests are not allowed.",
  );
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
