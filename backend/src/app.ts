import express from 'express';
import cors from 'cors';
import path from 'path';
import patientRoutes from './modules/patient/patient.routes.js';
import { errorHandler } from './middleware/errorHandler.js';

export const createApp = () => {
  const app = express();

  app.use(cors());
  app.use(express.json());

  // Health check
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // API routes
  app.use('/api/patients', patientRoutes);

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
