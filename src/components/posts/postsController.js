import aws from "aws-sdk";
import request from "request";
import dotenv from "dotenv";

import postsDAL from "./postsDAL.js";
import usersDAL from "../users/usersDAL.js";

dotenv.config();
const { AWS_SECRET_ACCESS, AWS_ACCESS_KEY } = process.env;

aws.config.update({
  secretAccessKey: AWS_SECRET_ACCESS,
  accessKeyId: AWS_ACCESS_KEY,
  region: "us-east-1",
});
const s3 = new aws.S3();

function putFromUrl(url, bucket, key, callback) {
  request(
    {
      url: url,
      encoding: null,
    },
    function (err, res, body) {
      if (err) {
        return callback(err, res);
      }
      s3.putObject(
        {
          Bucket: bucket,
          Key: key,
          Body: body,
        },
        callback
      );
    }
  );
}

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

    putFromUrl(args.data.url, "worldgram", args.data.url, function (err, res) {
      if (err) {
        throw err;
      }
    });

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

function shuffle(arr) {
  return arr
    .map((a) => [Math.random(), a])
    .sort((a, b) => a[0] - b[0])
    .map((a) => a[1]);
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
