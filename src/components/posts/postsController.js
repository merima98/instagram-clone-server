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

export default {
  addPost,
};
