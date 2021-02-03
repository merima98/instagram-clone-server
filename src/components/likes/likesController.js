import likesDAL from "./likesDAL.js";
import postsDAL from "../posts/postsDAL.js";

async function likePost(req, res) {
  try {
    const userId = res.locals.userId;

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
    const userId = res.locals.userId;

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

async function deleteManyLikes(req, res) {
  try {
    const postId = req.query.postId;
    const likes = await likesDAL.deleteMany({
      where: {
        postId: parseInt(postId),
      },
    });
    res.status(201).send(likes);
  } catch (err) {}
}
export default {
  likePost,
  dislikePost,
  deleteManyLikes,
};
