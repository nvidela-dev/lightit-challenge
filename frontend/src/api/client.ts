const API_BASE = '/api';

export class ApiError extends Error {
  constructor(
    public status: number,
    public errors: Record<string, string> | string
  ) {
    super(typeof errors === 'string' ? errors : 'Validation failed');
  }
}

export const request = <T>(endpoint: string, options?: RequestInit): Promise<T> =>
  fetch(`${API_BASE}${endpoint}`, options)
    .then((res) =>
      res.ok
        ? res.json()
        : res.json().catch(() => ({})).then((body) => {
            throw new ApiError(res.status, body.errors ?? body.error ?? 'Request failed');
          })
    );
