import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { MulterError } from 'multer';
import { errorHandler } from './errorHandler';
import { AppError, ValidationError, NotFoundError, ConflictError } from '@shared/errors.js';

const createMockResponse = () => {
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  } as unknown as Response;
  return res;
};

const createMockRequest = () => ({}) as Request;
const mockNext: NextFunction = vi.fn();

describe('errorHandler', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('handles AppError with errors object', () => {
    const res = createMockResponse();
    const error = new ValidationError({ email: 'Invalid email' });

    errorHandler(error, createMockRequest(), res, mockNext);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ errors: { email: 'Invalid email' } });
  });

  it('handles AppError without errors object', () => {
    const res = createMockResponse();
    const error = new NotFoundError('Patient not found');

    errorHandler(error, createMockRequest(), res, mockNext);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Patient not found' });
  });

  it('handles ConflictError', () => {
    const res = createMockResponse();
    const error = new ConflictError('email', 'Email already exists');

    errorHandler(error, createMockRequest(), res, mockNext);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({ errors: { email: 'Email already exists' } });
  });

  it('handles Prisma P2002 unique constraint error with string array target', () => {
    const res = createMockResponse();
    const error = new Prisma.PrismaClientKnownRequestError('Unique constraint', {
      code: 'P2002',
      clientVersion: '5.0.0',
      meta: { target: ['email'] },
    });

    errorHandler(error, createMockRequest(), res, mockNext);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      errors: { email: 'A patient with this email already exists' },
    });
  });

  it('handles Prisma P2002 with non-array target', () => {
    const res = createMockResponse();
    const error = new Prisma.PrismaClientKnownRequestError('Unique constraint', {
      code: 'P2002',
      clientVersion: '5.0.0',
      meta: { target: 'email' },
    });

    errorHandler(error, createMockRequest(), res, mockNext);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      errors: { field: 'A patient with this field already exists' },
    });
  });

  it('handles Prisma P2002 with empty array target', () => {
    const res = createMockResponse();
    const error = new Prisma.PrismaClientKnownRequestError('Unique constraint', {
      code: 'P2002',
      clientVersion: '5.0.0',
      meta: { target: [] },
    });

    errorHandler(error, createMockRequest(), res, mockNext);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      errors: { field: 'A patient with this field already exists' },
    });
  });

  it('handles non-P2002 Prisma error as internal error', () => {
    const res = createMockResponse();
    const error = new Prisma.PrismaClientKnownRequestError('Connection failed', {
      code: 'P1001',
      clientVersion: '5.0.0',
    });

    errorHandler(error, createMockRequest(), res, mockNext);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
  });

  it('handles MulterError LIMIT_FILE_SIZE', () => {
    const res = createMockResponse();
    const error = new MulterError('LIMIT_FILE_SIZE');

    errorHandler(error, createMockRequest(), res, mockNext);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      errors: { document: 'File size must be less than 5MB' },
    });
  });

  it('handles MulterError with unknown code', () => {
    const res = createMockResponse();
    const error = new MulterError('LIMIT_UNEXPECTED_FILE');

    errorHandler(error, createMockRequest(), res, mockNext);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      errors: { document: 'Unexpected field' },
    });
  });

  it('handles generic Error as internal server error', () => {
    const res = createMockResponse();
    const error = new Error('Something went wrong');

    errorHandler(error, createMockRequest(), res, mockNext);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
  });

  it('logs error to console', () => {
    const res = createMockResponse();
    const error = new Error('Test error');

    errorHandler(error, createMockRequest(), res, mockNext);

    expect(console.error).toHaveBeenCalledWith('Error:', error);
  });
});
