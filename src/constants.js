import dotenv from "dotenv";
dotenv.config();
const { PRIVATE_KEY } = process.env;
const EXPIRES_IN = "30 days";

export default {
  EXPIRES_IN,
  PRIVATE_KEY,
};
