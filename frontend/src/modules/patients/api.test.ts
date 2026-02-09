import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchPatients, createPatient } from './api';
import * as client from '../../api/client';

vi.mock('../../api/client', () => ({
  request: vi.fn(),
}));

const mockedRequest = vi.mocked(client.request);

describe('patients/api', () => {
  beforeEach(() => {
    mockedRequest.mockReset();
  });

  describe('fetchPatients', () => {
    it('fetches patients with default params', async () => {
      const mockResponse = { data: [], pagination: { page: 1, total: 0 } };
      mockedRequest.mockResolvedValue(mockResponse);

      const result = await fetchPatients();

      expect(mockedRequest).toHaveBeenCalledWith('/patients?page=1&limit=6');
      expect(result).toEqual(mockResponse);
    });

    it('fetches patients with custom params', async () => {
      const mockResponse = { data: [], pagination: { page: 2, total: 0 } };
      mockedRequest.mockResolvedValue(mockResponse);

      const result = await fetchPatients({ page: 2, limit: 10 });

      expect(mockedRequest).toHaveBeenCalledWith('/patients?page=2&limit=10');
      expect(result).toEqual(mockResponse);
    });
  });

  describe('createPatient', () => {
    it('creates patient with form data', async () => {
      const mockResponse = { data: { id: '1', fullName: 'John Doe' } };
      mockedRequest.mockResolvedValue(mockResponse);

      const formData = new FormData();
      formData.append('fullName', 'John Doe');

      const result = await createPatient(formData);

      expect(mockedRequest).toHaveBeenCalledWith('/patients', {
        method: 'POST',
        body: formData,
      });
      expect(result).toEqual(mockResponse);
    });
  });
});
