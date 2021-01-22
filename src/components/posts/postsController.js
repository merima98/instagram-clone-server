import postsDAL from "./postsDAL.js";

async function addPost(req, res) {
  try {
    const values = req.body;
    const args = {
      data: {
        description: values.description,
        url: values.url,
        user: {
          connect: { id: values.userId },
        },
      },
    };
    const post = await postsDAL.create(args);
    res.status(201).send(post);
  } catch (err) {}
}

async function getPosts(req, res) {
  try {
    const posts = await postsDAL.findAll({
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

    if (posts === null) {
      return res.status(400).send({ exception: "PostsNotFound" });
    }
    return res.status(200).send(posts);
  } catch (err) {}
}

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
    const post = await postsDAL.likePost(args);
    const posts = await postsDAL.findAll({
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
    const post = await postsDAL.getLike({
      where: { postId: parseInt(postId), userId: parseInt(userId) },
    });
    await postsDAL.deleteLike({
      where: {
        id: post.id,
      },
    });
    const posts = await postsDAL.findAll({
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
  addPost,
  getPosts,
  likePost,
  dislikePost,
};
