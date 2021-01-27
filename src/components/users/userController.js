import usersDAL from "../users/usersDAL.js";

async function getUser(req, res) {
  try {
    const username = req.query.username;

    const user = await usersDAL.findOne({
      where: {
        username: username,
      },
    });
    if (user === null) {
      return res.status(400).send({ exception: "UserNotFound" });
    }
    return res.status(200).send(user);
  } catch (err) {}
}

async function updateUser(req, res) {
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

    const user = await usersDAL.updateUser({
      where: { id: parseInt(req.body.id) },
      data: {
        email: req.body.email,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        username: req.body.username,
      },
    });
    const response = {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    };
    res.status(201).send(response);
  } catch (err) {}
}

export default {
  getUser,
  updateUser,
};
