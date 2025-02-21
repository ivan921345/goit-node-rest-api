import bcryptjs from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";
import gravatar from "gravatar";

dotenv.config();

import HttpError from "../helpers/HttpError.js";
import { ctrlWrapper } from "../helpers/ctrlWrapper.js";
import { User } from "../schemas/userSchema.js";

const SECRET_KEY = process.env.SECRET_KEY;

const register = async (req, res, next) => {
  const { email, password, name } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409);
  }

  const avatarURL = gravatar.url(email);

  const hashedPassword = await bcryptjs.hash(password, 10);

  await User.create({ ...req.body, password: hashedPassword, avatarURL });
  res.status(201).json({
    message: "User has been registered",
    user: {
      email,
      name,
    },
  });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw HttpError(401);
  }

  const isPasswrodCorrect = await bcryptjs.compare(password, user.password);

  if (!isPasswrodCorrect) {
    throw HttpError(401);
  }

  const payload = {
    id: user._id,
  };

  const token = jsonwebtoken.sign(payload, SECRET_KEY, {
    expiresIn: "24h",
  });

  await User.findOneAndUpdate({ email }, { token });

  req.user = user;

  res.status(200).json({
    user: {
      name: user.name,
      email: user.email,
    },
    token,
  });
};

const logout = async (req, res, next) => {
  const { email } = req.user;
  await User.findOneAndUpdate({ email }, { token: "" });

  res.status(204);
};

const getCurrent = async (req, res, next) => {
  const { email, subscription } = req.user;

  res.status(200).json({
    subscription,
    email,
  });
};

const changeSubscription = async (req, res, next) => {
  const { statusChange } = req.body;
  const { email } = req.user;
  if (!["starter", "pro", "business"].includes(statusChange)) {
    res.status(401),
      json({
        message: "bad request",
      });

    return;
  }

  const user = await User.findOne({ email });

  if (!user) {
    res.status(404).json({
      message: "User was not found",
    });
  }
  await User.findOneAndUpdate({ email }, { subscription: statusChange });

  res.status(200).json({
    message: "Status changed successfully",
  });
};

export default {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  logout: ctrlWrapper(logout),
  getCurrent: ctrlWrapper(getCurrent),
  changeSubscription: ctrlWrapper(changeSubscription),
};
