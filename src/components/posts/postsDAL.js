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
export default {
  create,
  findAll
};
