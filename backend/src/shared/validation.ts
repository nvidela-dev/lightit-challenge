import type { ZodIssue } from 'zod';

export const formatZodErrors = (issues: ZodIssue[]): Record<string, string> =>
  issues.reduce<Record<string, string>>((acc, { path, message }) => {
    const key = path.join('.');
    if (!(key in acc)) acc[key] = message;
    return acc;
  }, {});
