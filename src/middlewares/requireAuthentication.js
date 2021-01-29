import utils from "../utils/index.js";

function requireAuthentication(req, res, next) {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).send();
    }

    const decoded = utils.jwt.verify(token);

    res.locals.userId = decoded.id;

    next();
  } catch (err) {
    return res.status(401).send(err);
  }
}

export default requireAuthentication;
