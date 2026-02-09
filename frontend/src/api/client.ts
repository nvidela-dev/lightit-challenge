const API_BASE = '/api';
const REQUEST_TIMEOUT = 10000;

export class ApiError extends Error {
  constructor(
    public status: number,
    public errors: Record<string, string> | string
  ) {
    super(typeof errors === 'string' ? errors : 'Validation failed');
  }
}

export class NetworkError extends Error {
  constructor(message: string = 'Network request failed') {
    super(message);
    this.name = 'NetworkError';
  }
}

export const request = async <T>(endpoint: string, options?: RequestInit): Promise<T> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (res.ok) {
      return res.json();
    }

    const body = await res.json().catch(() => ({}));
    throw new ApiError(res.status, body.errors ?? body.error ?? 'Request failed');
  } catch (err) {
    clearTimeout(timeoutId);

    if (err instanceof ApiError) {
      throw err;
    }

    if (err instanceof Error) {
      if (err.name === 'AbortError') {
        throw new NetworkError('Request timed out. Please check your connection.');
      }
      if (err.message === 'Failed to fetch') {
        throw new NetworkError('Unable to connect to server. Please try again.');
      }
    }

    throw new NetworkError('An unexpected network error occurred.');
  }
};
