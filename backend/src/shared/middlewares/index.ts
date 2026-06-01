import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { logger } from '@/shared/logger';
import { errorHandler, notFoundHandler } from './error-handler.middleware';

export function initializeMiddlewares(app: Express): void {
  // Security middlewares
  app.use(helmet());
  app.use(cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, etc.)
      if (!origin) {
        return callback(null, true);
      }

      // Allowed origins list
      const allowedOrigins = [
        'http://localhost:3000',
        // 'https://frontend-production-82f8.up.railway.app',
      ];

      // Check if origin is in allowed list or matches patterns
      const isAllowed =
        allowedOrigins.includes(origin) ||
        origin.endsWith('.railway.app') ||
        origin.endsWith('.up.railway.app') ||
        // Allow any custom domain (tenant domains) - they all point to our frontend
        // In production, you could validate against registered tenant domains
        origin.startsWith('https://');

      callback(null, isAllowed);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-tenant-id', 'x-tenant-slug', 'x-idempotency-key'],
  }));

  // Compression
  app.use(compression());

  // Body parsing
  app.use(express.json({
    limit: '10mb',
    verify: (req, _res, buf) => {
      (req as any).rawBody = buf;
    },
  }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Request logging
  app.use((req, res, next) => {
    const start = Date.now();

    res.on('finish', () => {
      const duration = Date.now() - start;
      logger.info({
        method: req.method,
        path: req.path,
        statusCode: res.statusCode,
        duration: `${duration}ms`,
      });
    });

    next();
  });
}

export function initializeErrorHandlers(app: Express): void {
  app.use(notFoundHandler);
  app.use(errorHandler);
}

export * from './error-handler.middleware';
export * from './auth.middleware';
