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
    const posts = await postsDAL.findAll({ include: { user: true } });
    if (posts === null) {
      return res.status(400).send({ exception: "PostsNotFound" });
    }
    return res.status(200).send(posts);
  } catch (err) {}
}

export default {
  addPost,
  getPosts,
};
