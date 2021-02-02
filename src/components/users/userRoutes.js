import express from "express";

import userController from "./userController.js";
import middlewares from "../../middlewares/requireAuthentication.js";

const router = express.Router();

router.get("/user", middlewares, userController.getUser);
router.get("/userById", middlewares, userController.getUserById);
router.patch("/update", middlewares, userController.patchMySelf);

export default router;
