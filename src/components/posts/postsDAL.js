import pkg from "@prisma/client";
const { PrismaClient } = pkg;
const prisma = new PrismaClient();

async function create(values) {
  const post = await prisma.post.create(values);
  return post;
}
async function findAll(values) {
  const posts = await prisma.post.findMany(values);
  return posts;
}
async function likePost(values) {
  const likedPost = await prisma.likes.create(values);
  return likedPost;
}

async function getLike(values) {
  const likedPost = await prisma.likes.findFirst(values);
  return likedPost;
}
async function deleteLike(options) {
  const likedPost = await prisma.likes.delete(options);
  return likedPost;
}
async function findOne(options) {
  const item = await prisma.post.findFirst(options);
  return item;
}
export default {
  create,
  findAll,
  likePost,
  findOne,
  getLike,
  deleteLike,
};
