import postsDAL from "./postsDAL.js";
import usersDAL from "../users/usersDAL.js";
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

async function addPost(req, res) {
  try {
    const userId = checkForAuth(req.headers);

    const values = req.body;
    const args = {
      data: {
        description: values.description,
        url: values.url,
        user: {
          connect: { id: userId },
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
