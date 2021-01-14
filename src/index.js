import mongoose from "mongoose";
import express from "express";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";

dotenv.config();
const { PORT, MONGODB_URI } = process.env;

const app = express();

mongoose.connect(MONGODB_URI, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
});

app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());

app.use(authRoutes);

app.listen(PORT);
