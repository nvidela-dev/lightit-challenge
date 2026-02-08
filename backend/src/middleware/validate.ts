import type { Request, Response, NextFunction } from 'express';
import type { ZodSchema } from 'zod';
import { ValidationError } from '../shared/errors.js';
import { formatZodErrors } from '../shared/validation.js';

export const validate =
  <T>(schema: ZodSchema<T>) =>
  (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    result.success
      ? ((req.body = result.data), next())
      : next(new ValidationError(formatZodErrors(result.error.issues)));
  };
