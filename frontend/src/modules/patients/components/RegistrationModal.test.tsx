import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RegistrationModal } from './RegistrationModal';
import { ApiError, NetworkError } from '../../../api/client';

const mockMutateAsync = vi.fn();
const mockAddToast = vi.fn();

vi.mock('../hooks/usePatients', () => ({
  useCreatePatient: () => ({ mutateAsync: mockMutateAsync }),
}));

vi.mock('../../../hooks/useToast', () => ({
  useToast: () => ({ addToast: mockAddToast }),
}));

describe('RegistrationModal', () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers({ shouldAdvanceTime: true });
    // Mock URL.createObjectURL for file preview
    URL.createObjectURL = vi.fn(() => 'blob:test');
    URL.revokeObjectURL = vi.fn();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders form when open', () => {
    render(<RegistrationModal isOpen onClose={mockOnClose} />);

    expect(screen.getByText('Register New Patient')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Register Patient' })).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(<RegistrationModal isOpen={false} onClose={mockOnClose} />);

    expect(screen.queryByText('Register New Patient')).not.toBeInTheDocument();
  });

  it('shows loading state during submission', async () => {
    mockMutateAsync.mockImplementation(() => new Promise(() => {})); // Never resolves

    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<RegistrationModal isOpen onClose={mockOnClose} />);

    // Fill form
    await user.type(screen.getByPlaceholderText('John Doe'), 'Test User');
    await user.type(screen.getByPlaceholderText('john.doe@gmail.com'), 'test@gmail.com');
    await user.type(screen.getByPlaceholderText('1234567890'), '1234567890');

    // Upload file
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    await user.upload(input, file);

    // Submit
    await user.click(screen.getByRole('button', { name: 'Register Patient' }));

    await waitFor(() => {
      expect(screen.getByText('Registering patient...')).toBeInTheDocument();
    });
  });

  it('shows success toast and closes on successful submission', async () => {
    mockMutateAsync.mockResolvedValue({});

    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<RegistrationModal isOpen onClose={mockOnClose} />);

    // Fill form
    await user.type(screen.getByPlaceholderText('John Doe'), 'Test User');
    await user.type(screen.getByPlaceholderText('john.doe@gmail.com'), 'test@gmail.com');
    await user.type(screen.getByPlaceholderText('1234567890'), '1234567890');

    // Upload file
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    await user.upload(input, file);

    // Submit
    await user.click(screen.getByRole('button', { name: 'Register Patient' }));

    await waitFor(() => {
      expect(mockAddToast).toHaveBeenCalledWith({
        type: 'success',
        message: 'Email sent to test@gmail.com',
      });
    });

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('shows error toast on NetworkError', async () => {
    mockMutateAsync.mockRejectedValue(new NetworkError('Network error'));

    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<RegistrationModal isOpen onClose={mockOnClose} />);

    // Fill form
    await user.type(screen.getByPlaceholderText('John Doe'), 'Test User');
    await user.type(screen.getByPlaceholderText('john.doe@gmail.com'), 'test@gmail.com');
    await user.type(screen.getByPlaceholderText('1234567890'), '1234567890');

    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    await user.upload(input, file);

    await user.click(screen.getByRole('button', { name: 'Register Patient' }));

    await waitFor(() => {
      expect(mockAddToast).toHaveBeenCalledWith({
        type: 'error',
        message: 'Network error',
      });
    });
  });

  it('shows error toast on ApiError with string errors', async () => {
    mockMutateAsync.mockRejectedValue(new ApiError(400, 'Server error'));

    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<RegistrationModal isOpen onClose={mockOnClose} />);

    await user.type(screen.getByPlaceholderText('John Doe'), 'Test User');
    await user.type(screen.getByPlaceholderText('john.doe@gmail.com'), 'test@gmail.com');
    await user.type(screen.getByPlaceholderText('1234567890'), '1234567890');

    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    await user.upload(input, file);

    await user.click(screen.getByRole('button', { name: 'Register Patient' }));

    await waitFor(() => {
      expect(mockAddToast).toHaveBeenCalledWith({
        type: 'error',
        message: 'Server error',
      });
    });
  });

  it('shows error toast on ApiError with object errors', async () => {
    mockMutateAsync.mockRejectedValue(new ApiError(400, { email: 'Already exists', name: 'Invalid' }));

    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<RegistrationModal isOpen onClose={mockOnClose} />);

    await user.type(screen.getByPlaceholderText('John Doe'), 'Test User');
    await user.type(screen.getByPlaceholderText('john.doe@gmail.com'), 'test@gmail.com');
    await user.type(screen.getByPlaceholderText('1234567890'), '1234567890');

    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    await user.upload(input, file);

    await user.click(screen.getByRole('button', { name: 'Register Patient' }));

    await waitFor(() => {
      expect(mockAddToast).toHaveBeenCalledWith({
        type: 'error',
        message: expect.stringContaining('Already exists'),
      });
    });
  });

  it('shows generic error toast on unknown error', async () => {
    mockMutateAsync.mockRejectedValue(new Error('Unknown'));

    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<RegistrationModal isOpen onClose={mockOnClose} />);

    await user.type(screen.getByPlaceholderText('John Doe'), 'Test User');
    await user.type(screen.getByPlaceholderText('john.doe@gmail.com'), 'test@gmail.com');
    await user.type(screen.getByPlaceholderText('1234567890'), '1234567890');

    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    await user.upload(input, file);

    await user.click(screen.getByRole('button', { name: 'Register Patient' }));

    await waitFor(() => {
      expect(mockAddToast).toHaveBeenCalledWith({
        type: 'error',
        message: 'An unexpected error occurred',
      });
    });
  });

  it('has modal title', () => {
    render(<RegistrationModal isOpen onClose={mockOnClose} />);

    expect(screen.getByText('Register New Patient')).toBeInTheDocument();
  });
});
