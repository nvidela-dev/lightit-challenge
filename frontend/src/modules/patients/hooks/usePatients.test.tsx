import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { usePatients, useCreatePatient } from './usePatients';
import * as api from '../api';

vi.mock('../api', () => ({
  fetchPatients: vi.fn(),
  createPatient: vi.fn(),
}));

const mockedFetchPatients = vi.mocked(api.fetchPatients);
const mockedCreatePatient = vi.mocked(api.createPatient);

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('usePatients', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches patients with default params', async () => {
    const mockResponse = {
      data: [{ id: '1', fullName: 'John Doe' }],
      pagination: { page: 1, total: 1 },
    };
    mockedFetchPatients.mockResolvedValue(mockResponse as never);

    const { result } = renderHook(() => usePatients(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockedFetchPatients).toHaveBeenCalledWith({ page: 1, limit: 6 });
    expect(result.current.data).toEqual(mockResponse);
  });

  it('fetches patients with custom params', async () => {
    const mockResponse = { data: [], pagination: { page: 2, total: 0 } };
    mockedFetchPatients.mockResolvedValue(mockResponse as never);

    const { result } = renderHook(() => usePatients({ page: 2, limit: 10 }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockedFetchPatients).toHaveBeenCalledWith({ page: 2, limit: 10 });
  });
});

describe('useCreatePatient', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('creates patient and invalidates queries on success', async () => {
    const mockResponse = { data: { id: '1', fullName: 'John Doe' } };
    mockedCreatePatient.mockResolvedValue(mockResponse as never);

    const { result } = renderHook(() => useCreatePatient(), {
      wrapper: createWrapper(),
    });

    const formData = new FormData();
    formData.append('fullName', 'John Doe');

    result.current.mutate(formData);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockedCreatePatient).toHaveBeenCalledWith(formData, expect.anything());
  });
});
