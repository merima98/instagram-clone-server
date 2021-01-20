import express from "express";

import authController from "./authController.js";

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/signin", authController.signin);
router.get("/", authController.getUsers);

export default router;
