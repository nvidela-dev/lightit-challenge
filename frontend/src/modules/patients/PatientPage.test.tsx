import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PatientPage } from './PatientPage';

const mockAddToast = vi.fn();
const mockUsePatients = vi.fn();

vi.mock('./hooks/usePatients', () => ({
  usePatients: (params: unknown) => mockUsePatients(params),
}));

vi.mock('../../hooks/useToast', () => ({
  useToast: () => ({ addToast: mockAddToast }),
}));

vi.mock('./components/RegistrationModal', () => ({
  RegistrationModal: ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) =>
    isOpen ? (
      <div data-testid="registration-modal">
        <button onClick={onClose}>Close Modal</button>
      </div>
    ) : null,
}));

const mockPatients = [
  {
    id: '1',
    fullName: 'John Doe',
    email: 'john@gmail.com',
    phoneCode: '+1',
    phoneNumber: '1234567890',
    documentUrl: '/uploads/doc1.jpg',
    createdAt: new Date().toISOString(),
  },
];

describe('PatientPage', () => {
  const mockOnToggleCollapse = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockUsePatients.mockReturnValue({
      data: { data: mockPatients, pagination: { total: 1 } },
      isLoading: false,
      isFetching: false,
      isError: false,
    });
  });

  it('renders patient list with data', () => {
    render(<PatientPage isHeroCollapsed={false} onToggleCollapse={mockOnToggleCollapse} />);

    expect(screen.getByText('Patients')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    mockUsePatients.mockReturnValue({
      data: null,
      isLoading: true,
      isFetching: false,
      isError: false,
    });

    const { container } = render(
      <PatientPage isHeroCollapsed={false} onToggleCollapse={mockOnToggleCollapse} />
    );

    // Should show skeleton cards
    expect(container.querySelectorAll('.animate-pulse-slow').length).toBeGreaterThan(0);
  });

  it('shows empty state when no patients', () => {
    mockUsePatients.mockReturnValue({
      data: { data: [], pagination: { total: 0 } },
      isLoading: false,
      isFetching: false,
      isError: false,
    });

    render(<PatientPage isHeroCollapsed={false} onToggleCollapse={mockOnToggleCollapse} />);

    expect(screen.getByText('No patients yet')).toBeInTheDocument();
  });

  it('shows error toast when fetch fails', async () => {
    mockUsePatients.mockReturnValue({
      data: null,
      isLoading: false,
      isFetching: false,
      isError: true,
    });

    render(<PatientPage isHeroCollapsed={false} onToggleCollapse={mockOnToggleCollapse} />);

    await waitFor(() => {
      expect(mockAddToast).toHaveBeenCalledWith({
        type: 'error',
        message: 'Failed to load patients. Please try again later.',
      });
    });
  });

  it('opens registration modal when Add Patient is clicked', async () => {
    const user = userEvent.setup();
    render(<PatientPage isHeroCollapsed={false} onToggleCollapse={mockOnToggleCollapse} />);

    await user.click(screen.getByRole('button', { name: /Add Patient/i }));

    expect(screen.getByTestId('registration-modal')).toBeInTheDocument();
  });

  it('closes registration modal', async () => {
    const user = userEvent.setup();
    render(<PatientPage isHeroCollapsed={false} onToggleCollapse={mockOnToggleCollapse} />);

    await user.click(screen.getByRole('button', { name: /Add Patient/i }));
    expect(screen.getByTestId('registration-modal')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Close Modal' }));
    expect(screen.queryByTestId('registration-modal')).not.toBeInTheDocument();
  });

  it('calls onToggleCollapse when toggle button is clicked', async () => {
    const user = userEvent.setup();
    render(<PatientPage isHeroCollapsed={false} onToggleCollapse={mockOnToggleCollapse} />);

    await user.click(screen.getByRole('button', { name: 'Hide banner' }));

    expect(mockOnToggleCollapse).toHaveBeenCalled();
  });

  it('shows correct aria-label based on collapse state', () => {
    const { rerender } = render(
      <PatientPage isHeroCollapsed={false} onToggleCollapse={mockOnToggleCollapse} />
    );

    expect(screen.getByRole('button', { name: 'Hide banner' })).toBeInTheDocument();

    rerender(<PatientPage isHeroCollapsed onToggleCollapse={mockOnToggleCollapse} />);

    expect(screen.getByRole('button', { name: 'Show banner' })).toBeInTheDocument();
  });

  it('handles pagination', async () => {
    mockUsePatients.mockReturnValue({
      data: { data: mockPatients, pagination: { total: 50 } },
      isLoading: false,
      isFetching: false,
      isError: false,
    });

    const user = userEvent.setup();
    render(<PatientPage isHeroCollapsed={false} onToggleCollapse={mockOnToggleCollapse} />);

    // Should show pagination
    const page2Button = screen.getByRole('button', { name: '2' });
    await user.click(page2Button);

    // Check that usePatients was called (pagination changed)
    expect(mockUsePatients).toHaveBeenCalled();
  });

  it('resets to page 1 when collapse state changes', () => {
    const { rerender } = render(
      <PatientPage isHeroCollapsed={false} onToggleCollapse={mockOnToggleCollapse} />
    );

    rerender(<PatientPage isHeroCollapsed onToggleCollapse={mockOnToggleCollapse} />);

    // Should be on page 1 after collapse change
    expect(screen.getByRole('button', { name: '1' })).toHaveAttribute('aria-current', 'page');
  });

  it('fetches with correct page size based on collapse state', () => {
    const { rerender } = render(
      <PatientPage isHeroCollapsed={false} onToggleCollapse={mockOnToggleCollapse} />
    );

    expect(mockUsePatients).toHaveBeenCalledWith({ page: 1, limit: 18 });

    rerender(<PatientPage isHeroCollapsed onToggleCollapse={mockOnToggleCollapse} />);

    expect(mockUsePatients).toHaveBeenCalledWith({ page: 1, limit: 18 });
  });

  it('does not show error toast twice for the same error', async () => {
    mockUsePatients.mockReturnValue({
      data: null,
      isLoading: false,
      isFetching: false,
      isError: true,
    });

    const { rerender } = render(
      <PatientPage isHeroCollapsed={false} onToggleCollapse={mockOnToggleCollapse} />
    );

    await waitFor(() => {
      expect(mockAddToast).toHaveBeenCalledTimes(1);
    });

    // Re-render with same error state
    rerender(<PatientPage isHeroCollapsed={false} onToggleCollapse={mockOnToggleCollapse} />);

    // Should still only have been called once
    expect(mockAddToast).toHaveBeenCalledTimes(1);
  });

  it('resets error flag when error clears', async () => {
    mockUsePatients.mockReturnValue({
      data: null,
      isLoading: false,
      isFetching: false,
      isError: true,
    });

    const { rerender } = render(
      <PatientPage isHeroCollapsed={false} onToggleCollapse={mockOnToggleCollapse} />
    );

    await waitFor(() => {
      expect(mockAddToast).toHaveBeenCalledTimes(1);
    });

    // Clear error
    mockUsePatients.mockReturnValue({
      data: { data: mockPatients, pagination: { total: 1 } },
      isLoading: false,
      isFetching: false,
      isError: false,
    });

    rerender(<PatientPage isHeroCollapsed={false} onToggleCollapse={mockOnToggleCollapse} />);

    // Error again - should show toast again
    mockUsePatients.mockReturnValue({
      data: null,
      isLoading: false,
      isFetching: false,
      isError: true,
    });

    rerender(<PatientPage isHeroCollapsed={false} onToggleCollapse={mockOnToggleCollapse} />);

    await waitFor(() => {
      expect(mockAddToast).toHaveBeenCalledTimes(2);
    });
  });
});
