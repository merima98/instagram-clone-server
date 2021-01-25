import express from "express";

import postsController from "./postsController.js";

const router = express.Router();

router.post("/post", postsController.addPost);
router.get("/post", postsController.getPosts);
router.get("/userspost", postsController.findPostsByUser);

export default router;
