import express from "express";
import morgan from "morgan";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

import authRouter from "./routes/authRouter.js";
import contactsRouter from "./routes/contactsRouter.js";

const DB_HOST = process.env.DB_HOST;
const PORT = process.env.PORT || 3000;

const app = express();

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());

app.use("/api/contacts", contactsRouter);
app.use("/users", authRouter);

app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

const conn = mongoose.connect(DB_HOST, { dbName: "dbContacts" });

conn
  .then(() => {
    app.listen(PORT, () => {
      console.log("Server is running. Use our API on port: 3000");
    });
  })
  .catch((err) => {
    console.log("err", err);
  });
