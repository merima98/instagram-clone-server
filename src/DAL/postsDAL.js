import pkg from "@prisma/client";
const { PrismaClient } = pkg;
const prisma = new PrismaClient();

async function create(values) {
  const post = await prisma.post.create(values);
  return post;
}

export default {
  create,
};
