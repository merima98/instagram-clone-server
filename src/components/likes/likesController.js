import likesDAL from "./likesDAL.js";

async function likePost(req, res) {
  try {
    const postId = req.query.postId;
    const userId = req.query.userId;
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
    const post = await likesDAL.likePost(args);
    const posts = await likesDAL.findAll({
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
    const postId = req.query.postId;
    const userId = req.query.userId;
    const post = await likesDAL.getLike({
      where: { postId: parseInt(postId), userId: parseInt(userId) },
    });
    await likesDAL.deleteLike({
      where: {
        id: post.id,
      },
    });
    const posts = await likesDAL.findAll({
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
