import dotenv from "dotenv";
import sgMail from "@sendgrid/mail";
import twilio from "twilio";

import usersDAL from "../users/usersDAL.js";
import utils from "../../utils/index.js";

dotenv.config();

const {
  SENDGRID_API_KEY,
  SENDER_EMAIL,
  ACCOUNT_SID,
  AUTH_TOKEN,
  PHONE_TO,
  PHONE_FROM,
  LOGIN_ENABLED,
} = process.env;

const accountSid = ACCOUNT_SID;
const authToken = AUTH_TOKEN;
const client = new twilio(accountSid, authToken);

sgMail.setApiKey(SENDGRID_API_KEY);

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
    const payload = { id: user.id };

    const token = utils.jwt.sign(payload);
    const response = {
      user: {
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
      },
      token,
    };
    const message = {
      to: user.email,
      from: SENDER_EMAIL,
      subject: "Successfully created account!",
      html:
        "<strong>Great job! Enjoy using WORLDGRAM application, and enjoy posting amazing photos!</strong>",
    };
    try {
      await sgMail.send(message);
    } catch (error) {}
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
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
      },
      token,
    };
    if (LOGIN_ENABLED === "true") {
      try {
        client.messages.create({
          body: `You (${user.username}) logged to WORLDGRAM application!`,
          to: PHONE_TO,
          from: PHONE_FROM,
        });
      } catch (error) {}
    }
    return res.status(200).send(response);
  }
  return res.status(401).send({ exception: "NotAuthotizedException" });
}

export default {
  signup,
  signin,
};
