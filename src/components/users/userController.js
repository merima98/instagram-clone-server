import usersDAL from "../users/usersDAL.js";
import utils from "../../utils/index.js";

function checkForAuth(headers) {
  try {
    const token = headers.authorization;

    if (!token) {
      return null;
    }

    const decoded = utils.jwt.verify(token);
    const userId = decoded.id;

    return userId;
  } catch {
    return null;
  }
}

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

export default {
  getUser,
};
