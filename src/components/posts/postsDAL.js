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

async function findOne(options) {
  const item = await prisma.post.findFirst(options);
  return item;
}

async function deleteOne(options) {
  const item = await prisma.post.delete(options);
  return item;
}

async function updatePost(options) {
  console.log("Options, ", options);
  const item = await prisma.post.update(options);
  return item;
}
export default {
  create,
  findAll,
  findOne,
  deleteOne,
  updatePost,
};
