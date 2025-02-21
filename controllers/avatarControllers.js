import fs from "fs/promises";
import path, { join } from "path";
import { Jimp } from "jimp";

import { User } from "../schemas/userSchema.js";
import HttpError from "../helpers/HttpError.js";
import { ctrlWrapper } from "../helpers/ctrlWrapper.js";

const uploadDir = path.join(process.cwd(), "public", "avatars");

const changeUserAvatar = async (req, res, next) => {
  const { email, _id } = req.user;
  if (!email) {
    throw HttpError(404, "no such a user");
  }

  if (!req.file) {
    throw HttpError(400, "no file");
  }
  const { path: tempPath, originalname } = req.file;

  const filename = `${_id}_${originalname}`;
  const avatarURL = path.join("avatars", filename);
  const resultUpload = join(uploadDir, filename);

  await fs.rename(tempPath, resultUpload);
  console.log(typeof resultUpload);
  const image = await Jimp.read(resultUpload);
  image.resize({ w: 250, h: 250 });
  await image.write(resultUpload);

  await User.findOneAndUpdate({ email }, { avatarURL });

  res.status(200).json({
    avatarURL,
    email,
  });
};

export default {
  changeUserAvatar: ctrlWrapper(changeUserAvatar),
};
