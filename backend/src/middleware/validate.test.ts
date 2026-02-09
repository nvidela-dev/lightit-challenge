import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { validate, validateWithFile } from './validate';
import { ValidationError } from '@shared/errors.js';

vi.mock('@shared/file.js', () => ({
  removeFile: vi.fn().mockResolvedValue(undefined),
}));

const createMockRequest = (overrides: Partial<Request> = {}) =>
  ({
    body: {},
    query: {},
    ...overrides,
  }) as Request;

const createMockResponse = () => ({}) as Response;

describe('validate middleware', () => {
  const testSchema = z.object({
    name: z.string().min(1),
  });

  it('calls next with ValidationError when body validation fails', () => {
    const middleware = validate(testSchema, 'body');
    const req = createMockRequest({ body: { name: '' } });
    const res = createMockResponse();
    const next = vi.fn();

    middleware(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(ValidationError));
  });

  it('calls next with ValidationError when query validation fails', () => {
    const middleware = validate(testSchema, 'query');
    const req = createMockRequest({ query: {} });
    const res = createMockResponse();
    const next = vi.fn();

    middleware(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(ValidationError));
  });

  it('calls next without error when validation passes', () => {
    const middleware = validate(testSchema, 'body');
    const req = createMockRequest({ body: { name: 'John' } });
    const res = createMockResponse();
    const next = vi.fn();

    middleware(req, res, next);

    expect(next).toHaveBeenCalledWith();
    expect(req.body).toEqual({ name: 'John' });
  });
});

describe('validateWithFile middleware', () => {
  const testSchema = z.object({
    name: z.string().min(1),
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls next with ValidationError when file is missing', async () => {
    const middleware = validateWithFile(testSchema);
    const req = createMockRequest({ body: { name: 'John' } });
    const res = createMockResponse();
    const next = vi.fn();

    await middleware(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(ValidationError));
    const error = next.mock.calls[0][0] as ValidationError;
    expect(error.errors).toHaveProperty('document', 'Document photo is required');
  });

  it('uses custom field name and label', async () => {
    const middleware = validateWithFile(testSchema, 'photo', 'Profile photo');
    const req = createMockRequest({ body: { name: 'John' } });
    const res = createMockResponse();
    const next = vi.fn();

    await middleware(req, res, next);

    const error = next.mock.calls[0][0] as ValidationError;
    expect(error.errors).toHaveProperty('photo', 'Profile photo is required');
  });

  it('calls next without error when file and body are valid', async () => {
    const middleware = validateWithFile(testSchema);
    const req = createMockRequest({
      body: { name: 'John' },
      file: { path: '/uploads/test.jpg' } as Express.Multer.File,
    });
    const res = createMockResponse();
    const next = vi.fn();

    await middleware(req, res, next);

    expect(next).toHaveBeenCalledWith();
    expect(req.body).toEqual({ name: 'John' });
  });
});
