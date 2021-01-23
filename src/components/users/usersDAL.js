import pkg from "@prisma/client";
const { PrismaClient } = pkg;
const prisma = new PrismaClient();

async function create(values) {
  const user = await prisma.user.create(values);
  return user;
}

async function findOne(options) {
  const item = await prisma.user.findFirst(options);
  return item;
}

export default {
  create,
  findOne,
};
