import { Router } from 'express';
import { container } from 'tsyringe';
import { DashboardController } from './dashboard.controller';
import { authMiddleware } from '@/shared/middlewares/auth.middleware';

const router = Router();

const getController = () => container.resolve(DashboardController);

router.get(
  '/stats',
  authMiddleware(),
  (req, res, next) => getController().getStats(req, res, next)
);

router.get(
  '/recent-items',
  authMiddleware(),
  (req, res, next) => getController().getRecentItems(req, res, next)
);

export default router;
