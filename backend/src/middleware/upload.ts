import multer from 'multer';
import path from 'path';
import { randomUUID } from 'crypto';
import { ValidationError } from '@shared/errors.js';

/**
 * File Upload Strategy
 *
 * Files are saved to disk before validation. Cleanup is handled by:
 * 1. validateWithFile middleware - deletes file if body/file validation fails
 * 2. Controller error handler - deletes file if service fails (e.g., duplicate email)
 *
 * Production considerations for orphaned files:
 * - Use a temp directory with a cron job to sweep files older than 1 hour
 * - Migrate to S3/GCS with lifecycle policies (auto-delete after 24h if not referenced)
 * - Track uploads in DB with status (pending/confirmed) and sweep unconfirmed
 * - Use presigned URLs for direct-to-cloud uploads, bypassing server storage entirely
 */

const UPLOAD_DIR = path.join(process.cwd(), 'uploads');
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIMETYPES = ['image/jpeg'];

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `${randomUUID()}${ext}`;
    cb(null, filename);
  },
});

const fileFilter: multer.Options['fileFilter'] = (_req, file, cb) => {
  if (!ALLOWED_MIMETYPES.includes(file.mimetype)) {
    cb(new ValidationError({ document: 'Only .jpg files are allowed' }));
    return;
  }
  cb(null, true);
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
});
