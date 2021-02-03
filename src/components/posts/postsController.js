import postsDAL from "./postsDAL.js";
import usersDAL from "../users/usersDAL.js";

async function addPost(req, res) {
  try {
    const userId = res.locals.userId;
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

function shuffle(array) {
  const result = [];
  const source = array.concat([]);

  while (source.length) {
    let index = Math.floor(Math.random() * source.length);
    result.push(source.splice(index, 1)[0]);
  }
  return result;
}

async function getRandomPosts(req, res) {
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
    return res.status(200).send(shuffle(posts));
  } catch (err) {}
}

async function getPostById(req, res) {
  try {
    const postId = req.query.postId;
    const post = await postsDAL.findOne({
      where: { id: parseInt(postId) },
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
    if (post === null) {
      return res.status(400).send({ exception: "PostsNotFound" });
    }
    return res.status(200).send(post);
  } catch (err) {}
}

async function deletePost(req, res) {
  try {
    const postId = req.query.postId;
    const post = await postsDAL.deleteOne({
      where: { id: parseInt(postId) },
    });

    const user = await usersDAL.findOne({
      where: { id: post.userId },
    });

    const posts = await postsDAL.findAll({
      orderBy: {
        createdAt: "desc",
      },
      where: { user: user },
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
    if (post === null) {
      return res.status(400).send({ exception: "PostsNotFound" });
    }
    return res.status(200).send(posts);
  } catch (err) {}
}
export default {
  addPost,
  getPosts,
  findPostsByUser,
  getRandomPosts,
  getPostById,
  deletePost,
};
