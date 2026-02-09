import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import path from 'path';
import patientRoutes from '@modules/patient/patient.routes.js';
import { errorHandler } from '@/middleware/errorHandler.js';

const isProduction = process.env.NODE_ENV === 'production';

const corsOptions = {
  origin: isProduction ? false : 'http://localhost:5173',
};

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // 100 requests per window
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later' },
});

export const createApp = () => {
  const app = express();

  app.use(helmet());
  app.use(cors(corsOptions));
  app.use(morgan(isProduction ? 'combined' : 'dev'));
  app.use(express.json());

  // Health check (no rate limit)
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // API routes with rate limiting
  app.use('/api/patients', apiLimiter, patientRoutes);

  // Serve uploaded files
  app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

  // Serve frontend static files in production
  app.use(express.static(path.join(process.cwd(), 'public')));

  // SPA fallback - serve index.html for all non-API routes
  app.get('*', (_req, res) => {
    const indexPath = path.join(process.cwd(), 'public', 'index.html');
    res.sendFile(indexPath, (err) => {
      err && res.status(404).json({ error: 'Not found' });
    });
  });

  // Error handler (must be last)
  app.use(errorHandler);

  return app;
};
