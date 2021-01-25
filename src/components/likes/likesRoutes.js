import express from "express";

import likesController from "./likesController.js";

const router = express.Router();

router.post("/like", likesController.likePost);
router.post("/dislike", likesController.dislikePost);

export default router;
