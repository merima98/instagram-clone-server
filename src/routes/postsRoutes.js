import express from "express";

import postsController from "../controllers/postsController.js";

const router = express.Router();

router.post("/post", postsController.addPost);

export default router;
