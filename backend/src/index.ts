import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

const app = express();

app.use(cors());
app.use(express.json());
dotenv.config();

const PORT = process.env.PORT;
const DB_URL = process.env.MONGODB_URL as string;

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
