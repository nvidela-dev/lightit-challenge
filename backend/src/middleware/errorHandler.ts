import type { Request, Response, NextFunction } from 'express';
import { AppError } from '@shared/errors.js';
import { Prisma } from '@prisma/client';
import { MulterError } from 'multer';

type ErrorResponse = { status: number; body: object };

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === 'string');

const handlePrismaError = (err: Prisma.PrismaClientKnownRequestError): ErrorResponse | null => {
  if (err.code === 'P2002') {
    const target = err.meta?.target;
    const field = isStringArray(target) ? target[0] ?? 'field' : 'field';
    return {
      status: 400,
      body: { errors: { [field]: `A patient with this ${field} already exists` } },
    };
  }
  return null;
};

const multerErrorMessages: Record<string, string> = {
  LIMIT_FILE_SIZE: 'File size must be less than 5MB',
};

const defaultError: ErrorResponse = { status: 500, body: { error: 'Internal server error' } };

const resolveError = (err: Error): ErrorResponse => {
  if (err instanceof AppError) {
    return {
      status: err.statusCode,
      body: err.errors ? { errors: err.errors } : { error: err.message },
    };
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    const result = handlePrismaError(err);
    if (result) return result;
  }

  if (err instanceof MulterError) {
    return {
      status: 400,
      body: {
        errors: {
          document: multerErrorMessages[err.code] ?? err.message,
        },
      },
    };
  }

  return defaultError;
};

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error('Error:', err);
  const { status, body } = resolveError(err);
  res.status(status).json(body);
};
