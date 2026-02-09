import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Pagination } from './Pagination';

describe('Pagination', () => {
  const mockOnPageChange = vi.fn();

  beforeEach(() => {
    mockOnPageChange.mockClear();
  });

  it('renders all navigation buttons', () => {
    render(<Pagination currentPage={1} totalPages={5} onPageChange={mockOnPageChange} />);

    expect(screen.getByRole('button', { name: 'First page' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Previous page' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Next page' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Last page' })).toBeInTheDocument();
  });

  it('disables first and previous buttons on first page', () => {
    render(<Pagination currentPage={1} totalPages={5} onPageChange={mockOnPageChange} />);

    expect(screen.getByRole('button', { name: 'First page' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Previous page' })).toBeDisabled();
  });

  it('disables next and last buttons on last page', () => {
    render(<Pagination currentPage={5} totalPages={5} onPageChange={mockOnPageChange} />);

    expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Last page' })).toBeDisabled();
  });

  it('calls onPageChange when clicking page number', async () => {
    const user = userEvent.setup();
    render(<Pagination currentPage={1} totalPages={5} onPageChange={mockOnPageChange} />);

    await user.click(screen.getByRole('button', { name: '3' }));

    expect(mockOnPageChange).toHaveBeenCalledWith(3);
  });

  it('calls onPageChange when clicking next button', async () => {
    const user = userEvent.setup();
    render(<Pagination currentPage={2} totalPages={5} onPageChange={mockOnPageChange} />);

    await user.click(screen.getByRole('button', { name: 'Next page' }));

    expect(mockOnPageChange).toHaveBeenCalledWith(3);
  });

  it('calls onPageChange when clicking previous button', async () => {
    const user = userEvent.setup();
    render(<Pagination currentPage={3} totalPages={5} onPageChange={mockOnPageChange} />);

    await user.click(screen.getByRole('button', { name: 'Previous page' }));

    expect(mockOnPageChange).toHaveBeenCalledWith(2);
  });

  it('calls onPageChange when clicking first button', async () => {
    const user = userEvent.setup();
    render(<Pagination currentPage={3} totalPages={5} onPageChange={mockOnPageChange} />);

    await user.click(screen.getByRole('button', { name: 'First page' }));

    expect(mockOnPageChange).toHaveBeenCalledWith(1);
  });

  it('calls onPageChange when clicking last button', async () => {
    const user = userEvent.setup();
    render(<Pagination currentPage={3} totalPages={5} onPageChange={mockOnPageChange} />);

    await user.click(screen.getByRole('button', { name: 'Last page' }));

    expect(mockOnPageChange).toHaveBeenCalledWith(5);
  });

  it('shows ellipsis when there are many pages', () => {
    render(<Pagination currentPage={5} totalPages={10} onPageChange={mockOnPageChange} />);

    const ellipses = screen.getAllByText('...');
    expect(ellipses.length).toBeGreaterThan(0);
  });

  it('shows all page numbers when total pages is 7 or less', () => {
    render(<Pagination currentPage={1} totalPages={7} onPageChange={mockOnPageChange} />);

    for (let i = 1; i <= 7; i++) {
      expect(screen.getByRole('button', { name: String(i) })).toBeInTheDocument();
    }
  });

  it('handles single page', () => {
    render(<Pagination currentPage={1} totalPages={1} onPageChange={mockOnPageChange} />);

    expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'First page' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Last page' })).toBeDisabled();
  });

  it('handles zero total pages', () => {
    render(<Pagination currentPage={1} totalPages={0} onPageChange={mockOnPageChange} />);

    // Should show at least page 1
    expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument();
  });

  it('marks current page with aria-current', () => {
    render(<Pagination currentPage={3} totalPages={5} onPageChange={mockOnPageChange} />);

    expect(screen.getByRole('button', { name: '3' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('button', { name: '2' })).not.toHaveAttribute('aria-current');
  });
});
