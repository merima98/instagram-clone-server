import postsDAL from "./postsDAL.js";
import usersDAL from "../users/usersDAL.js";

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

    const createdPost = await postsDAL.findOne({
      where: { id: post.id },
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
    res.status(201).send(createdPost);
  } catch (err) {}
}

async function getPosts(req, res) {
  try {
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

    if (posts === null) {
      return res.status(400).send({ exception: "PostsNotFound" });
    }
    return res.status(200).send(posts);
  } catch (err) {}
}

async function findPostsByUser(req, res) {
  try {
    const username = req.query.username;

    const user = await usersDAL.findOne({
      where: { username: username },
    });

    const posts = await postsDAL.findAll({
      orderBy: {
        createdAt: "desc",
      },
      where: { user: user },
    });

    if (posts === null) {
      return res.status(400).send({ exception: "PostsNotFound" });
    }
    return res.status(200).send(posts);
  } catch (err) {}
}

export default {
  addPost,
  getPosts,
  findPostsByUser,
};
