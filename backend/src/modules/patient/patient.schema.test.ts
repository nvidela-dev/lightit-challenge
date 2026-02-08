import { describe, it, expect } from 'vitest';
import { createPatientSchema } from './patient.schema.js';

describe('createPatientSchema', () => {
  const validInput = {
    fullName: 'John Doe',
    email: 'john.doe@gmail.com',
    phoneCode: '+1',
    phoneNumber: '1234567890',
  };

  describe('fullName', () => {
    it('accepts valid names with letters and spaces', () => {
      const result = createPatientSchema.safeParse(validInput);
      expect(result.success).toBe(true);
    });

    it('accepts names with accented characters', () => {
      const result = createPatientSchema.safeParse({
        ...validInput,
        fullName: 'José García',
      });
      expect(result.success).toBe(true);
    });

    it('rejects names with numbers', () => {
      const result = createPatientSchema.safeParse({
        ...validInput,
        fullName: 'John123',
      });
      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toContain('letters and spaces');
    });

    it('rejects empty names', () => {
      const result = createPatientSchema.safeParse({
        ...validInput,
        fullName: '',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('email', () => {
    it('accepts valid gmail addresses', () => {
      const result = createPatientSchema.safeParse(validInput);
      expect(result.success).toBe(true);
    });

    it('rejects non-gmail addresses', () => {
      const result = createPatientSchema.safeParse({
        ...validInput,
        email: 'john@yahoo.com',
      });
      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toContain('@gmail.com');
    });

    it('rejects invalid email format', () => {
      const result = createPatientSchema.safeParse({
        ...validInput,
        email: 'not-an-email',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('phoneCode', () => {
    it('accepts valid phone codes', () => {
      ['+1', '+44', '+598', '+1234'].forEach((phoneCode) => {
        const result = createPatientSchema.safeParse({ ...validInput, phoneCode });
        expect(result.success).toBe(true);
      });
    });

    it('rejects codes without plus sign', () => {
      const result = createPatientSchema.safeParse({
        ...validInput,
        phoneCode: '1',
      });
      expect(result.success).toBe(false);
    });

    it('rejects codes with more than 4 digits', () => {
      const result = createPatientSchema.safeParse({
        ...validInput,
        phoneCode: '+12345',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('phoneNumber', () => {
    it('accepts valid phone numbers (6-15 digits)', () => {
      ['123456', '1234567890', '123456789012345'].forEach((phoneNumber) => {
        const result = createPatientSchema.safeParse({ ...validInput, phoneNumber });
        expect(result.success).toBe(true);
      });
    });

    it('rejects numbers shorter than 6 digits', () => {
      const result = createPatientSchema.safeParse({
        ...validInput,
        phoneNumber: '12345',
      });
      expect(result.success).toBe(false);
    });

    it('rejects numbers with non-digit characters', () => {
      const result = createPatientSchema.safeParse({
        ...validInput,
        phoneNumber: '123-456-7890',
      });
      expect(result.success).toBe(false);
    });
  });
});
