import type { ZodIssue } from 'zod';

export const formatZodErrors = (issues: ZodIssue[]): Record<string, string> =>
  issues.reduce<Record<string, string>>(
    (acc, { path, message }) => {
      const key = path.join('.');
      return key in acc ? acc : { ...acc, [key]: message };
    },
    {}
  );
