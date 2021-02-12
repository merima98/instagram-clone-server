import express from "express";

import likesController from "./likesController.js";
import middlewares from "../../middlewares/requireAuthentication.js";

const router = express.Router();

router.post("/like", middlewares, likesController.likePost);
router.post("/dislike", middlewares, likesController.dislikePost);
router.delete("/deleteLikes", likesController.deleteManyLikes);
router.get(
  "/likesOfPostByUser",
  middlewares,
  likesController.likesOfPostByUser
);

export default router;
