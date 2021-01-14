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
    const user = await usersDAL.create({ ...req.body, password: hash });
    const payload = { id: user._id };

    const token = utils.jwt.sign(payload);
    const response = {
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
      },
      token,
    };
    res.status(201).send(response);
  } catch (err) {}
}

export default {
  signup,
};
