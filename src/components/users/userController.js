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

export default {
  getUser,
};
