import { z } from 'zod';

export const createPatientSchema = z.object({
  fullName: z
    .string()
    .min(1, 'Full name is required')
    .regex(/^[\p{L}\s]+$/u, 'Full name must only contain letters and spaces'),
  email: z
    .string()
    .email('Invalid email address')
    .refine((val) => val.endsWith('@gmail.com'), 'Email must be a @gmail.com address'),
  phoneCode: z
    .string()
    .regex(/^\+\d{1,4}$/, 'Phone code must be + followed by 1-4 digits'),
  phoneNumber: z
    .string()
    .regex(/^\d{6,15}$/, 'Phone number must be 6-15 digits'),
});

export type CreatePatientFormValues = z.infer<typeof createPatientSchema>;
