import { Router } from "express";
import { container } from "tsyringe";
import { AuthController } from "./auth.controller";
import { validateMiddleware } from "@/shared/middlewares/validate.middleware";
import { loginSchema, refreshTokenSchema, registerSchema } from "./dto/auth.dto";
import { authMiddleware } from "@/shared/middlewares/auth.middleware";

const router = Router();

const getController = () => container.resolve(AuthController);

router.post(
    '/register',
    validateMiddleware({ body: registerSchema }),
    (req, res, next) => getController().register(req, res, next)
  );
  
router.post(
    '/login',
    validateMiddleware({ body: loginSchema }),
    (req, res, next) => getController().login(req, res, next)
  );

router.post(
    '/refresh',
    validateMiddleware({ body: refreshTokenSchema }),
    (req, res, next) => getController().refreshToken(req, res, next)
  );

router.get(
    '/me',
    authMiddleware(),
    (req, res, next) => getController().getMe(req, res, next)
  );

export default router;