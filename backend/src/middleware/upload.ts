import multer from 'multer';
import path from 'path';
import { randomUUID } from 'crypto';
import { ValidationError } from '../shared/errors.js';

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
