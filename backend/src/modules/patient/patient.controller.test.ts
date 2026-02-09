import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Request, Response, NextFunction } from 'express';
import { createPatient } from './patient.controller';
import * as patientService from './patient.service.js';

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
    it('calls next with error when file is missing', () => {
      const req = createMockRequest({ file: undefined });
      const res = createMockResponse();
      const next: NextFunction = vi.fn();

      createPatient(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
      const error = (next as ReturnType<typeof vi.fn>).mock.calls[0][0] as Error;
      expect(error.message).toBe('File is required');
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

      // Wait for promise to resolve
      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(mockedService.createPatient).toHaveBeenCalledWith(
        expect.objectContaining({ fullName: 'John Doe' }),
        '/uploads/test.jpg'
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ data: mockPatient });
    });
  });
});
