import argon from "argon2";

function hash(password) {
  return argon.hash(password);
}

function verify(hash, plain) {
  return argon.verify(hash, plain);
}

export default {
  hash,
  verify,
};
