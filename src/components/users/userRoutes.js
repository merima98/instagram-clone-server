import express from "express";

import userController from "./userController.js";

const router = express.Router();

router.get("/user", userController.getUser);
router.put("/updateUser", userController.updateUser);

export default router;
