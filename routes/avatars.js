import express from "express";
import upload from "../middlewares/upload.js";
import { authenticate } from "../middlewares/authenticate.js";
import avatarControllers from "../controllers/avatarControllers.js";

const avatarsRouter = express.Router();

avatarsRouter.patch(
  "/",
  authenticate,
  upload.single("avatar"),
  avatarControllers.changeUserAvatar
);

export default avatarsRouter;
