import type { Request, Response, NextFunction } from 'express';
import { AppError } from '@shared/errors.js';
import { Prisma } from '@prisma/client';
import { MulterError } from 'multer';

type ErrorResponse = { status: number; body: object };

const prismaErrorMessages: Record<string, (err: Prisma.PrismaClientKnownRequestError) => ErrorResponse> = {
  P2002: (err) => {
    const field = ((err.meta?.target as string[]) ?? [])[0] ?? 'field';
    return {
      status: 400,
      body: { errors: { [field]: `A patient with this ${field} already exists` } },
    };
  },
};

const multerErrorMessages: Record<string, string> = {
  LIMIT_FILE_SIZE: 'File size must be less than 5MB',
};

type ErrorMatcher = [(err: Error) => boolean, (err: Error) => ErrorResponse];

const errorMatchers: ErrorMatcher[] = [
  [
    (err): err is AppError => err instanceof AppError,
    (err) => ({
      status: (err as AppError).statusCode,
      body: (err as AppError).errors
        ? { errors: (err as AppError).errors }
        : { error: err.message },
    }),
  ],
  [
    (err): err is Prisma.PrismaClientKnownRequestError =>
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code in prismaErrorMessages,
    (err) => prismaErrorMessages[(err as Prisma.PrismaClientKnownRequestError).code](
      err as Prisma.PrismaClientKnownRequestError
    ),
  ],
  [
    (err): err is MulterError => err instanceof MulterError,
    (err) => ({
      status: 400,
      body: {
        errors: {
          document: multerErrorMessages[(err as MulterError).code] ?? (err as MulterError).message,
        },
      },
    }),
  ],
];

const defaultError: ErrorResponse = { status: 500, body: { error: 'Internal server error' } };

const resolveError = (err: Error): ErrorResponse =>
  errorMatchers.find(([matches]) => matches(err))?.[1](err) ?? defaultError;

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
