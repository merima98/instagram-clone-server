import express from "express";

import postsController from "./postsController.js";
import middlewares from "../../middlewares/requireAuthentication.js";

const router = express.Router();

router.post("/post", middlewares, postsController.addPost);
router.get("/post", middlewares, postsController.getPosts);
router.get("/getPostById", postsController.getPostById);
router.delete("/delete", postsController.deletePost);
router.get("/randomPosts", middlewares, postsController.getRandomPosts);
router.get("/userspost", middlewares, postsController.findPostsByUser);

export default router;
