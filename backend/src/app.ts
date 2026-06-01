import express from 'express';
import healthRoutes from '@/modules/health/health.route';
import authRoutes from '@/modules/auth/auth.route';
import itemsRoutes from '@/modules/items/items.route';
import dashboardRoutes from '@/modules/dashboard/dashboard.route';
import { config } from './config';
import { initialize } from 'objection';
import { initializeErrorHandlers, initializeMiddlewares } from './shared/middlewares';
export function createApp()  {
    const app = express();

    initializeMiddlewares(app);

    const apiPrefix = `/api/${config.app.apiVersion}`;
    app.use('/health', healthRoutes)


    app.use(`${apiPrefix}/auth`, authRoutes);
    app.use(`${apiPrefix}/items`, itemsRoutes);
    app.use(`${apiPrefix}/dashboard`, dashboardRoutes);

    initializeErrorHandlers(app);
    return app;
}