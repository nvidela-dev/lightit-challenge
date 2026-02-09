import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Toast } from './Toast';
import type { Toast as ToastType } from '../contexts/toastContext';

describe('Toast', () => {
  const mockOnDismiss = vi.fn();

  const createToast = (type: ToastType['type']): ToastType => ({
    id: '1',
    type,
    message: `Test ${type} message`,
  });

  beforeEach(() => {
    mockOnDismiss.mockClear();
  });

  it('renders success toast with correct styling', () => {
    render(<Toast toast={createToast('success')} onDismiss={mockOnDismiss} />);

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Test success message')).toBeInTheDocument();
  });

  it('renders error toast with correct styling', () => {
    render(<Toast toast={createToast('error')} onDismiss={mockOnDismiss} />);

    expect(screen.getByText('Test error message')).toBeInTheDocument();
  });

  it('renders info toast with correct styling', () => {
    render(<Toast toast={createToast('info')} onDismiss={mockOnDismiss} />);

    expect(screen.getByText('Test info message')).toBeInTheDocument();
  });

  it('renders warning toast with correct styling', () => {
    render(<Toast toast={createToast('warning')} onDismiss={mockOnDismiss} />);

    expect(screen.getByText('Test warning message')).toBeInTheDocument();
  });

  it('calls onDismiss when dismiss button is clicked', async () => {
    const user = userEvent.setup();
    render(<Toast toast={createToast('success')} onDismiss={mockOnDismiss} />);

    await user.click(screen.getByRole('button', { name: 'Dismiss' }));

    expect(mockOnDismiss).toHaveBeenCalledWith('1');
  });
});
