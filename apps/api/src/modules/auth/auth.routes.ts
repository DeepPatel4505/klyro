import { Router } from "express";
import { authController } from "./auth.controller.js";
import { validateBody } from "../../middlewares/validate.middleware.js";
import { registerSchema, loginSchema } from "./auth.validation.js";

const authRouter = Router();

authRouter.post("/register", validateBody(registerSchema), authController.register);
authRouter.post("/login", validateBody(loginSchema), authController.login);

export default authRouter;
