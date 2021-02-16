import likesDAL from "./likesDAL.js";

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
    const like = await likesDAL.getLike({
      where: { postId: parseInt(postId), userId: parseInt(userId) },
    });
    if (!like) {
      const liked = await likesDAL.likePost(args);
      res.status(200).send({ postId, likes: liked });
    }
    if (like) {
      await likesDAL.deleteLike({
        where: {
          id: like.id,
        },
      });
      res.status(200).send({ postId });
    }
  } catch (err) {}
}

async function likesOfPostByUser(req, res) {
  try {
    const userId = res.locals.userId;
    const postId = req.query.postId;

    const like = await likesDAL.getLike({
      where: { postId: parseInt(postId), userId: parseInt(userId) },
    });
    res.status(200).send({ like });
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
  deleteManyLikes,
  likesOfPostByUser,
};
