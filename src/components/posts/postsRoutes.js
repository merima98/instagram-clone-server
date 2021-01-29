import express from "express";

import postsController from "./postsController.js";
import middlewares from "../../middlewares/requireAuthentication.js";

const router = express.Router();

router.post("/post", middlewares, postsController.addPost);
router.get("/post", postsController.getPosts);
router.get("/userspost", postsController.findPostsByUser);

export default router;
