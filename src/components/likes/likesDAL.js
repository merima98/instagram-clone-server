import pkg from "@prisma/client";
const { PrismaClient } = pkg;
const prisma = new PrismaClient();

async function findAll(values) {
  const posts = await prisma.post.findMany(values);
  return posts;
}
async function deleteMany(values) {
  const likes = await prisma.likes.deleteMany(values);
  return likes;
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
export default {
  findAll,
  likePost,
  getLike,
  deleteLike,
  deleteMany,
};
