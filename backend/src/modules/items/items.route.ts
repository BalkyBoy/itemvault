import { Router } from 'express';
import { container } from 'tsyringe';
import { ItemsController } from './items.controller';
import { validateMiddleware } from '@/shared/middlewares/validate.middleware';
import { authMiddleware } from '@/shared/middlewares/auth.middleware';
import { itemsValidation } from './dto/items.dto';

const router = Router();

const getController = () => container.resolve(ItemsController);

router.get(
  '/',
  validateMiddleware(itemsValidation.list),
  (req, res, next) => getController().list(req, res, next)
);

router.post(
  '/',
  authMiddleware(),
  validateMiddleware(itemsValidation.create),
  (req, res, next) => getController().create(req, res, next)
);

router.put(
  '/:id',
  authMiddleware(),
  validateMiddleware(itemsValidation.update),
  (req, res, next) => getController().update(req, res, next)
);

router.delete(
  '/:id',
  authMiddleware(),
  validateMiddleware(itemsValidation.delete),
  (req, res, next) => getController().delete(req, res, next)
);

export default router;
