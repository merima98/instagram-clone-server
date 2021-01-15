import usersDAL from "../DAL/usersDAL.js";
import utils from "../utils/index.js";

async function signup(req, res) {
  try {
    const existingUser = await usersDAL.findOne({
      where: { email: req.body.data.email },
    });

    if (existingUser !== null) {
      return res.status(400).send({ exception: "EmailAllreadyInUseException" });
    }

    const existingUsername = await usersDAL.findOne({
      where: { username: req.body.data.username },
    });
    if (existingUsername !== null) {
      return res
        .status(400)
        .send({ exception: "UsernameAllreadyInUseException" });
    }

    const hash = await utils.password.hash(req.body.data.password);
    const user = await usersDAL.create({
      data: { ...req.body.data, password: hash },
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
    where: { username: req.body.data.username },
  });
  if (user === null) {
    return res.status(400).send({ exception: "UserNotFound" });
  }
  const verified = await utils.password.verify(
    user.password,
    req.body.data.password
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

export default {
  signup,
  signin,
};
