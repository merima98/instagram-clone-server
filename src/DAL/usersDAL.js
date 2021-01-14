import User from "../models/userModel.js";

async function create(values) {
  const user = await User.create(values);
  return user;
}
async function findAll(values) {
  const users = await User.find(values);
  return users;
}

async function fingByEmail(email) {
  const user = await User.findOne({ where: { email } });
  return user;
}

async function findOne(options) {
  const item = await User.findOne(options);
  return item;
}

export default {
  create,
  findAll,
  fingByEmail,
  findOne,
};
