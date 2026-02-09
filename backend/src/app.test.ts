import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import path from 'path';
import fs from 'fs';
import express from 'express';
import { createApp } from './app';

// Mock the patient routes to avoid database dependency
vi.mock('@modules/patient/patient.routes.js', () => {
  const router = express.Router();
  router.get('/', (_req, res) => res.json({ data: [], pagination: {} }));
  return { default: router };
});

describe('app', () => {
  describe('SPA fallback', () => {
    const publicDir = path.join(process.cwd(), 'public');
    const indexPath = path.join(publicDir, 'index.html');

    beforeEach(() => {
      vi.restoreAllMocks();
    });

    it('returns 404 JSON when index.html does not exist', async () => {
      // Ensure the file doesn't exist for this test
      const indexExisted = fs.existsSync(indexPath);
      let backupContent: string | null = null;

      if (indexExisted) {
        backupContent = fs.readFileSync(indexPath, 'utf-8');
        fs.unlinkSync(indexPath);
      }

      try {
        const app = createApp();
        const response = await request(app).get('/non-existent-page');

        expect(response.status).toBe(404);
        expect(response.body).toEqual({ error: 'Not found' });
      } finally {
        // Restore the file if it existed
        if (backupContent !== null) {
          fs.writeFileSync(indexPath, backupContent);
        }
      }
    });

    it('serves index.html for non-API routes when file exists', async () => {
      // Create public directory and index.html if they don't exist
      if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true });
      }

      const indexExisted = fs.existsSync(indexPath);
      if (!indexExisted) {
        fs.writeFileSync(indexPath, '<!DOCTYPE html><html><head></head><body></body></html>');
      }

      try {
        const app = createApp();
        const response = await request(app).get('/some-spa-route');

        expect(response.status).toBe(200);
        expect(response.text).toContain('<!DOCTYPE html>');
      } finally {
        // Clean up only if we created the file
        if (!indexExisted) {
          fs.unlinkSync(indexPath);
        }
      }
    });
  });

  describe('health check', () => {
    it('returns ok status', async () => {
      const app = createApp();
      const response = await request(app).get('/api/health');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'ok');
      expect(response.body).toHaveProperty('timestamp');
    });
  });

  describe('production environment', () => {
    const originalEnv = process.env.NODE_ENV;

    it('uses production settings when NODE_ENV is production', async () => {
      // Set production environment
      process.env.NODE_ENV = 'production';

      // Re-import to get fresh module with production settings
      vi.resetModules();
      const { createApp: createProdApp } = await import('./app');

      const app = createProdApp();
      const response = await request(app).get('/api/health');

      expect(response.status).toBe(200);

      // Restore environment
      process.env.NODE_ENV = originalEnv;
      vi.resetModules();
    });
  });
});
