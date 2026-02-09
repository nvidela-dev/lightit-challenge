import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { request, ApiError, NetworkError } from './client';

const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('api/client', () => {
  beforeEach(() => {
    mockFetch.mockReset();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('ApiError', () => {
    it('creates error with string message', () => {
      const error = new ApiError(400, 'Bad request');
      expect(error.status).toBe(400);
      expect(error.errors).toBe('Bad request');
      expect(error.message).toBe('Bad request');
    });

    it('creates error with errors object', () => {
      const errors = { email: 'Invalid email' };
      const error = new ApiError(400, errors);
      expect(error.status).toBe(400);
      expect(error.errors).toEqual(errors);
      expect(error.message).toBe('Validation failed');
    });
  });

  describe('NetworkError', () => {
    it('creates error with default message', () => {
      const error = new NetworkError();
      expect(error.message).toBe('Network request failed');
      expect(error.name).toBe('NetworkError');
    });

    it('creates error with custom message', () => {
      const error = new NetworkError('Custom message');
      expect(error.message).toBe('Custom message');
    });
  });

  describe('request', () => {
    it('returns JSON data on successful response', async () => {
      const mockData = { data: [{ id: 1 }] };
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockData),
      });

      const result = await request('/patients');

      expect(result).toEqual(mockData);
      expect(mockFetch).toHaveBeenCalledWith('/api/patients', expect.any(Object));
    });

    it('throws ApiError with errors object on error response', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 400,
        json: () => Promise.resolve({ errors: { email: 'Invalid' } }),
      });

      await expect(request('/patients')).rejects.toThrow(ApiError);

      try {
        await request('/patients');
      } catch (err) {
        expect(err).toBeInstanceOf(ApiError);
        const apiError = err as ApiError;
        expect(apiError.status).toBe(400);
        expect(apiError.errors).toEqual({ email: 'Invalid' });
      }
    });

    it('throws ApiError with error string on error response', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ error: 'Server error' }),
      });

      try {
        await request('/patients');
      } catch (err) {
        expect(err).toBeInstanceOf(ApiError);
        const apiError = err as ApiError;
        expect(apiError.errors).toBe('Server error');
      }
    });

    it('throws ApiError with default message when JSON parse fails', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
        json: () => Promise.reject(new Error('Invalid JSON')),
      });

      try {
        await request('/patients');
      } catch (err) {
        expect(err).toBeInstanceOf(ApiError);
        const apiError = err as ApiError;
        expect(apiError.errors).toBe('Request failed');
      }
    });

    it('throws NetworkError on timeout', async () => {
      // Create an AbortError
      const abortError = new Error('Aborted');
      abortError.name = 'AbortError';
      mockFetch.mockRejectedValue(abortError);

      await expect(request('/patients')).rejects.toThrow(NetworkError);
      await expect(request('/patients')).rejects.toThrow('Request timed out');
    });

    it('throws NetworkError on fetch failure', async () => {
      mockFetch.mockRejectedValue(new Error('Failed to fetch'));

      await expect(request('/patients')).rejects.toThrow(NetworkError);
      await expect(request('/patients')).rejects.toThrow('Unable to connect to server');
    });

    it('throws NetworkError on unexpected error', async () => {
      mockFetch.mockRejectedValue(new Error('Unknown error'));

      await expect(request('/patients')).rejects.toThrow(NetworkError);
      await expect(request('/patients')).rejects.toThrow('unexpected network error');
    });

    it('re-throws ApiError when caught in outer catch', async () => {
      const apiError = new ApiError(400, 'Test error');
      mockFetch.mockRejectedValue(apiError);

      await expect(request('/patients')).rejects.toThrow(apiError);
    });

    it('passes options to fetch', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({}),
      });

      await request('/patients', { method: 'POST', body: 'test' });

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/patients',
        expect.objectContaining({ method: 'POST', body: 'test' })
      );
    });
  });
});
