import express from "express";
import userControllers from "../controllers/userControllers.js";
import { userRegisterSchema, userLoginSchema } from "../schemas/userSchema.js";
import validateBody from "../helpers/validateBody.js";
import { authenticate } from "../middlewares/authenticate.js";

const router = express.Router();

router.post(
  "/register",
  validateBody(userRegisterSchema),
  userControllers.register
);

router.post("/login", validateBody(userLoginSchema), userControllers.login);

router.post("/logout", authenticate, userControllers.logout);

router.get("/current", authenticate, userControllers.getCurrent);

router.patch("/", authenticate, userControllers.changeSubscription);

export default router;
