import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Request, Response, NextFunction } from 'express';
import { createPatient } from './patient.controller';
import * as patientService from './patient.service.js';
import { ValidationError } from '@shared/errors.js';

vi.mock('./patient.service.js', () => ({
  createPatient: vi.fn(),
}));

vi.mock('@shared/file.js', () => ({
  removeFile: vi.fn().mockResolvedValue(undefined),
}));

const mockedService = vi.mocked(patientService);

const createMockRequest = (overrides: Partial<Request> = {}) =>
  ({
    body: {
      fullName: 'John Doe',
      email: 'john@gmail.com',
      phoneCode: '+1',
      phoneNumber: '1234567890',
    },
    ...overrides,
  }) as Request;

const createMockResponse = () => {
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  } as unknown as Response;
  return res;
};

describe('patient.controller', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createPatient', () => {
    it('calls next with ValidationError when file is missing', async () => {
      const req = createMockRequest({ file: undefined });
      const res = createMockResponse();
      const next: NextFunction = vi.fn();

      await createPatient(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(ValidationError));
      const error = (next as ReturnType<typeof vi.fn>).mock.calls[0][0] as ValidationError;
      expect(error.errors).toEqual({ document: 'Document photo is required' });
    });

    it('creates patient when file is present', async () => {
      const mockPatient = { id: '1', fullName: 'John Doe' };
      mockedService.createPatient.mockResolvedValue(mockPatient as never);

      const req = createMockRequest({
        file: { filename: 'test.jpg', path: '/uploads/test.jpg' } as Express.Multer.File,
      });
      const res = createMockResponse();
      const next: NextFunction = vi.fn();

      await createPatient(req, res, next);

      expect(mockedService.createPatient).toHaveBeenCalledWith(
        expect.objectContaining({ fullName: 'John Doe' }),
        '/uploads/test.jpg'
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ data: mockPatient });
    });
  });
});
