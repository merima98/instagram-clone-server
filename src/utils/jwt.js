import jsonwebtoken from "jsonwebtoken";
import constants from "../constants.js";

function sign(payload) {
  const token = jsonwebtoken.sign(payload, constants.PRIVATE_KEY, {
    expiresIn: constants.EXPIRES_IN,
  });
  return token;
}

function verify(token) {
  const decoded = jsonwebtoken.verify(token, constants.PRIVATE_KEY);
  return decoded;
}

export default {
  sign,
  verify,
};
