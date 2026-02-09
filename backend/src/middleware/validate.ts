import type { Request, Response, NextFunction } from 'express';
import type { ZodSchema } from 'zod';
import { unlink } from 'fs/promises';
import { ValidationError } from '@shared/errors.js';
import { formatZodErrors } from '@shared/validation.js';

type Source = 'body' | 'query';

export const validate =
  <T>(schema: ZodSchema<T>, source: Source = 'body') =>
  (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[source]);
    if (result.success) {
      req[source] = result.data as typeof req[typeof source];
      next();
    } else {
      next(new ValidationError(formatZodErrors(result.error.issues)));
    }
  };

const removeFile = (file?: Express.Multer.File) =>
  file ? unlink(file.path).catch(() => {}) : Promise.resolve();

export const validateWithFile =
  <T>(schema: ZodSchema<T>, fileField: string = 'document', fileLabel: string = 'Document photo') =>
  async (req: Request, _res: Response, next: NextFunction) => {
    const file = req.file;
    const result = schema.safeParse(req.body);

    const errors = {
      ...(!file && { [fileField]: `${fileLabel} is required` }),
      ...(!result.success && formatZodErrors(result.error.issues)),
    };

    if (Object.keys(errors).length) {
      await removeFile(file);
      return next(new ValidationError(errors));
    }

    req.body = result.data;
    next();
  };
