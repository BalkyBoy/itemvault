import 'reflect-metadata';
import { logger } from "./shared/logger";
import { initializeDatabase, closeDatabase } from './database/index';
import { config } from "./config";
import { createApp } from './app';
import { registerDependencies } from './bootstrap';
async function startServer(): Promise<void> {
    try {
        await initializeDatabase();
        logger.info('Database initialized');

        const {getKnex} = await import('./database/index');
        await getKnex().migrate.latest({
            directory: './dist/database/migrations',
        });
        logger.info('Database migrations applied');

        registerDependencies();
        logger.info('Dependencies registered');

        const app = createApp();
        logger.info('App created');

        const server = app.listen(config.app.port, () => {
            logger.info(`Server running on port ${config.app.port}`);
            logger.info(`Environment: ${config.app.env}`);
            logger.info(`API Version: http://localhost:${config.app.port}/api/${config.app.apiVersion}`);

        });
        const shutdown = async (signal: string) => {
            logger.info(`${signal} received. Shutting down gracefully...`);
            server.close(async () => {
                logger.info('Http server closed');
                await closeDatabase();
                logger.info('Database connection closed');
                process.exit(0);
            });
            setTimeout(() => {
                logger.error('Could not close connections in time, forcefully shutting down');
                process.exit(1);
              }, 10000);
        };
        process.on('SIGINT', () => shutdown('SIGINT'));
        process.on('SIGTERM', () => shutdown('SIGTERM'));

        process.on('uncaughtException', (error) => {
            logger.error({ err: error }, 'Uncaught exception');
            process.exit(1);
        });
        process.on('unhandledRejection', (reason, promise) => {
            logger.error({ err: reason, promise }, 'Unhandled rejection');
        });
    } catch (error) {
        logger.error({ err: error }, 'Server startup failed');
        process.exit(1);
    }
}
startServer();