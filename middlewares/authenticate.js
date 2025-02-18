import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";
import { User } from "../schemas/userSchema.js";

dotenv.config();

import HttpError from "../helpers/HttpError.js";

const { SECRET_KEY } = process.env;

export const authenticate = async (req, res, next) => {
  try {
    const { authorization = "" } = req.headers;

    const [bearer, token] = authorization.split(" ");

    if (bearer !== "Bearer" || !token) {
      throw HttpError(401);
    }

    const { id } = jsonwebtoken.verify(token, SECRET_KEY);

    const user = await User.findById(id);

    if (!user || !user.token || user.token !== token) {
      throw HttpError(401);
    }

    req.user = user;

    next();
  } catch (err) {
    next(err);
  }
};
