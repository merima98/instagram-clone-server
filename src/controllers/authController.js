import usersDAL from "../DAL/usersDAL.js";
import utils from "../utils/index.js";

async function signup(req, res) {
  try {
    const existingUser = await usersDAL.findOne({
      where: { email: req.body.email },
    });

    if (existingUser !== null) {
      return res.status(400).send({ exception: "EmailAllreadyInUseException" });
    }

    const existingUsername = await usersDAL.findOne({
      where: { username: req.body.username },
    });
    if (existingUsername !== null) {
      return res
        .status(400)
        .send({ exception: "UsernameAllreadyInUseException" });
    }

    const hash = await utils.password.hash(req.body.password);
    const user = await usersDAL.create({
      data: { ...req.body, password: hash },
    });

    const payload = { id: user._id };

    const token = utils.jwt.sign(payload);
    const response = {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
      token,
    };
    res.status(201).send(response);
  } catch (err) {}
}

async function signin(req, res) {
  const user = await usersDAL.findOne({
    where: { username: req.body.username },
  });
  if (user === null) {
    return res.status(400).send({ exception: "UserNotFound" });
  }
  const verified = await utils.password.verify(
    user.password,
    req.body.password
  );

  if (verified) {
    const payload = { id: user.id };
    const token = utils.jwt.sign(payload);
    const response = {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
      token,
    };
    return res.status(200).send(response);
  }
  return res.status(401).send({ exception: "NotAuthotizedException" });
}

async function getUsers(req, res) {
  try {
    const user = await usersDAL.findAll({
      where: {
        username: {
          startsWith: req.body.username,
        },
      },
    });

    if (user === null) {
      return res.status(400).send({ exception: "UserNotFound" });
    }
    return res.status(200).send(user);
  } catch (err) {
    console.log(err);
  }
}

export default {
  signup,
  signin,
  getUsers,
};
