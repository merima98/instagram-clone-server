import likesDAL from "./likesDAL.js";
import postsDAL from "../posts/postsDAL.js";
import utils from "../../utils/index.js";

function checkForAuth(headers) {
  try {
    const token = headers.authorization;

    if (!token) {
      return null;
    }

    const decoded = utils.jwt.verify(token);
    const userId = decoded.id;

    return userId;
  } catch {
    return null;
  }
}

async function likePost(req, res) {
  try {
    const userId = checkForAuth(req.headers);

    const postId = req.query.postId;
    const args = {
      data: {
        user: {
          connect: { id: parseInt(userId) },
        },
        post: {
          connect: { id: parseInt(postId) },
        },
      },
    };
    await likesDAL.likePost(args);

    const posts = await postsDAL.findAll({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: true,
        likes: {
          include: {
            user: true,
            post: true,
          },
        },
      },
    });

    res.status(201).send(posts);
  } catch (err) {}
}

async function dislikePost(req, res) {
  try {
    const userId = checkForAuth(req.headers);

    const postId = req.query.postId;
    const post = await likesDAL.getLike({
      where: { postId: parseInt(postId), userId: userId },
    });
    await likesDAL.deleteLike({
      where: {
        id: post.id,
      },
    });

    const posts = await postsDAL.findAll({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: true,
        likes: {
          include: {
            user: true,
            post: true,
          },
        },
      },
    });

    res.status(201).send(posts);
  } catch (err) {}
}

export default {
  likePost,
  dislikePost,
};
