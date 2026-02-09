import { describe, it, expect, vi } from 'vitest';
import type { Request } from 'express';
import { upload } from './upload';
import { ValidationError } from '@shared/errors.js';

describe('upload middleware', () => {
  describe('fileFilter', () => {
    const mockRequest = {} as Request;

    it('accepts jpeg files', () => {
      const cb = vi.fn();
      const file = { mimetype: 'image/jpeg' } as Express.Multer.File;

      // Access the fileFilter through the multer instance
      // @ts-expect-error - accessing internal multer property for testing
      upload.fileFilter(mockRequest, file, cb);

      expect(cb).toHaveBeenCalledWith(null, true);
    });

    it('rejects non-jpeg files with ValidationError', () => {
      const cb = vi.fn();
      const file = { mimetype: 'image/png' } as Express.Multer.File;

      // @ts-expect-error - accessing internal multer property for testing
      upload.fileFilter(mockRequest, file, cb);

      expect(cb).toHaveBeenCalledWith(expect.any(ValidationError));
      const error = cb.mock.calls[0][0] as ValidationError;
      expect(error.errors).toEqual({ document: 'Only .jpg files are allowed' });
    });
  });
});
