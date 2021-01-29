import express from "express";

import likesController from "./likesController.js";
import middlewares from "../../middlewares/requireAuthentication.js";

const router = express.Router();

router.post("/like", middlewares, likesController.likePost);
router.post("/dislike", middlewares, likesController.dislikePost);

export default router;
