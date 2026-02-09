import { describe, it, expect } from 'vitest';
import { AppError, ValidationError, NotFoundError, ConflictError } from './errors';

describe('AppError', () => {
  it('creates error with statusCode and message', () => {
    const error = new AppError(500, 'Server error');

    expect(error.statusCode).toBe(500);
    expect(error.message).toBe('Server error');
    expect(error.name).toBe('AppError');
    expect(error.errors).toBeUndefined();
  });

  it('creates error with errors object', () => {
    const error = new AppError(400, 'Validation failed', { email: 'Invalid' });

    expect(error.errors).toEqual({ email: 'Invalid' });
  });
});

describe('ValidationError', () => {
  it('creates 400 error with errors object', () => {
    const error = new ValidationError({ email: 'Invalid email' });

    expect(error.statusCode).toBe(400);
    expect(error.message).toBe('Validation failed');
    expect(error.name).toBe('ValidationError');
    expect(error.errors).toEqual({ email: 'Invalid email' });
  });
});

describe('NotFoundError', () => {
  it('creates 404 error with custom message', () => {
    const error = new NotFoundError('Patient not found');

    expect(error.statusCode).toBe(404);
    expect(error.message).toBe('Patient not found');
    expect(error.name).toBe('NotFoundError');
  });

  it('creates 404 error with default message', () => {
    const error = new NotFoundError();

    expect(error.statusCode).toBe(404);
    expect(error.message).toBe('Resource not found');
  });
});

describe('ConflictError', () => {
  it('creates 409 error with field and message', () => {
    const error = new ConflictError('email', 'Email already exists');

    expect(error.statusCode).toBe(409);
    expect(error.message).toBe('Email already exists');
    expect(error.name).toBe('ConflictError');
    expect(error.errors).toEqual({ email: 'Email already exists' });
  });
});
