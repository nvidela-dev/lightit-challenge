import { z } from 'zod';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 18;
const MAX_LIMIT = 100;

export const getPatientsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(DEFAULT_PAGE),
  limit: z.coerce.number().int().min(1).max(MAX_LIMIT).default(DEFAULT_LIMIT),
});

export type GetPatientsQuery = z.infer<typeof getPatientsQuerySchema>;

export const createPatientSchema = z.object({
  fullName: z
    .string()
    .min(1, 'Full name is required')
    .max(255, 'Full name must be less than 255 characters')
    .regex(
      /^[a-zA-ZÀ-ÿ\s]+$/,
      'Full name must only contain letters and spaces'
    ),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email format')
    .max(255, 'Email must be less than 255 characters')
    .refine((email) => email.endsWith('@gmail.com'), {
      message: 'Email must be a @gmail.com address',
    }),
  phoneCode: z
    .string()
    .min(1, 'Phone code is required')
    .regex(/^\+\d{1,4}$/, 'Phone code must be + followed by 1-4 digits'),
  phoneNumber: z
    .string()
    .min(6, 'Phone number must be at least 6 digits')
    .max(15, 'Phone number must be at most 15 digits')
    .regex(/^\d+$/, 'Phone number must only contain digits'),
});

export type CreatePatientInput = z.infer<typeof createPatientSchema>;
