import { describe, it, expect } from 'vitest';
import type { ZodIssue } from 'zod';
import { formatZodErrors } from './validation';

describe('formatZodErrors', () => {
  it('converts zod issues to error record', () => {
    const issues: ZodIssue[] = [
      { path: ['email'], message: 'Invalid email', code: 'custom' },
      { path: ['name'], message: 'Required', code: 'custom' },
    ];

    const result = formatZodErrors(issues);

    expect(result).toEqual({
      email: 'Invalid email',
      name: 'Required',
    });
  });

  it('handles nested paths', () => {
    const issues: ZodIssue[] = [
      { path: ['user', 'email'], message: 'Invalid', code: 'custom' },
    ];

    const result = formatZodErrors(issues);

    expect(result).toEqual({ 'user.email': 'Invalid' });
  });

  it('keeps first error for duplicate paths', () => {
    const issues: ZodIssue[] = [
      { path: ['email'], message: 'First error', code: 'custom' },
      { path: ['email'], message: 'Second error', code: 'custom' },
    ];

    const result = formatZodErrors(issues);

    expect(result).toEqual({ email: 'First error' });
  });

  it('returns empty object for empty issues array', () => {
    const result = formatZodErrors([]);

    expect(result).toEqual({});
  });
});
