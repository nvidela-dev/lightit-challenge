import { render, screen, act, waitFor } from '@testing-library/react';
import { ToastProvider } from './ToastProvider';
import { useToast } from '../hooks/useToast';

// Test component that uses the toast context
const TestConsumer = () => {
  const { toasts, addToast, removeToast } = useToast();

  return (
    <div>
      <button onClick={() => addToast({ type: 'success', message: 'Test toast' })}>
        Add Toast
      </button>
      <button onClick={() => addToast({ type: 'error', message: 'Error toast', duration: 100 })}>
        Add Error Toast
      </button>
      {toasts.map((toast) => (
        <div key={toast.id} data-testid={`toast-${toast.id}`}>
          {toast.message}
          <button onClick={() => removeToast(toast.id)}>Remove</button>
        </div>
      ))}
    </div>
  );
};

describe('ToastProvider', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('provides toast context to children', () => {
    render(
      <ToastProvider>
        <TestConsumer />
      </ToastProvider>
    );

    expect(screen.getByRole('button', { name: 'Add Toast' })).toBeInTheDocument();
  });

  it('adds toast when addToast is called', async () => {
    render(
      <ToastProvider>
        <TestConsumer />
      </ToastProvider>
    );

    act(() => {
      screen.getByRole('button', { name: 'Add Toast' }).click();
    });

    expect(screen.getByText('Test toast')).toBeInTheDocument();
  });

  it('removes toast when removeToast is called', async () => {
    render(
      <ToastProvider>
        <TestConsumer />
      </ToastProvider>
    );

    act(() => {
      screen.getByRole('button', { name: 'Add Toast' }).click();
    });

    expect(screen.getByText('Test toast')).toBeInTheDocument();

    act(() => {
      screen.getByRole('button', { name: 'Remove' }).click();
    });

    expect(screen.queryByText('Test toast')).not.toBeInTheDocument();
  });

  it('auto-removes toast after duration', async () => {
    vi.useRealTimers(); // Use real timers for this test with short duration

    render(
      <ToastProvider>
        <TestConsumer />
      </ToastProvider>
    );

    act(() => {
      screen.getByRole('button', { name: 'Add Error Toast' }).click();
    });

    expect(screen.getByText('Error toast')).toBeInTheDocument();

    // Wait for the toast to auto-dismiss (100ms duration + buffer)
    await waitFor(
      () => {
        expect(screen.queryByText('Error toast')).not.toBeInTheDocument();
      },
      { timeout: 500 }
    );
  });

  it('creates unique toast ids', () => {
    render(
      <ToastProvider>
        <TestConsumer />
      </ToastProvider>
    );

    act(() => {
      screen.getByRole('button', { name: 'Add Toast' }).click();
      screen.getByRole('button', { name: 'Add Toast' }).click();
    });

    const toasts = screen.getAllByText('Test toast');
    expect(toasts).toHaveLength(2);
  });

  it('cleans up timers on unmount', () => {
    const { unmount } = render(
      <ToastProvider>
        <TestConsumer />
      </ToastProvider>
    );

    act(() => {
      screen.getByRole('button', { name: 'Add Toast' }).click();
    });

    // Unmount should clear timers without error
    unmount();
  });

  it('clears timer when manually removing toast', () => {
    render(
      <ToastProvider>
        <TestConsumer />
      </ToastProvider>
    );

    act(() => {
      screen.getByRole('button', { name: 'Add Error Toast' }).click();
    });

    // Remove before auto-dismiss
    act(() => {
      screen.getByRole('button', { name: 'Remove' }).click();
    });

    expect(screen.queryByText('Error toast')).not.toBeInTheDocument();

    // Advancing time should not cause issues
    act(() => {
      vi.advanceTimersByTime(1000);
    });
  });
});
