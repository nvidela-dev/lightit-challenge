import { applyDebugSettings } from '../utils/debug';

const API_BASE = '/api';

export class ApiError extends Error {
  constructor(
    public status: number,
    public errors: Record<string, string> | string
  ) {
    super(typeof errors === 'string' ? errors : 'Validation failed');
  }
}

export const request = async <T>(endpoint: string, options?: RequestInit): Promise<T> => {
  await applyDebugSettings();

  const res = await fetch(`${API_BASE}${endpoint}`, options);

  if (res.ok) {
    return res.json();
  }

  const body = await res.json().catch(() => ({}));
  throw new ApiError(res.status, body.errors ?? body.error ?? 'Request failed');
};
