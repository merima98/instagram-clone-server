import express from "express";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";

dotenv.config();
const { PORT, MONGODB_URI } = process.env;

const app = express();
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());
app.use(authRoutes);
app.listen(PORT);
