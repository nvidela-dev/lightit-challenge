import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PatientCard } from './PatientCard';

const mockPatient = {
  id: '123',
  fullName: 'John Doe',
  email: 'john.doe@gmail.com',
  phoneCode: '+1',
  phoneNumber: '5551234567',
  documentUrl: '/uploads/test.jpg',
  createdAt: '2024-01-15T10:00:00.000Z',
};

describe('PatientCard', () => {
  it('renders patient name and date', () => {
    render(<PatientCard patient={mockPatient} />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jan 15, 2024')).toBeInTheDocument();
  });

  it('renders patient document image', () => {
    render(<PatientCard patient={mockPatient} />);

    const img = screen.getByAltText("John Doe's document");
    expect(img).toHaveAttribute('src', '/uploads/test.jpg');
  });

  it('has collapsed details by default', () => {
    render(<PatientCard patient={mockPatient} />);

    const detailsSection = screen.getByText('john.doe@gmail.com').parentElement?.parentElement;
    expect(detailsSection).toHaveClass('max-h-0', 'opacity-0');
  });

  it('expands to show email and phone on click', async () => {
    const user = userEvent.setup();
    render(<PatientCard patient={mockPatient} />);

    await user.click(screen.getByRole('button'));

    const detailsSection = screen.getByText('john.doe@gmail.com').parentElement?.parentElement;
    expect(detailsSection).toHaveClass('max-h-24', 'opacity-100');
  });

  it('collapses on second click', async () => {
    const user = userEvent.setup();
    render(<PatientCard patient={mockPatient} />);

    await user.click(screen.getByRole('button'));
    const detailsSection = screen.getByText('john.doe@gmail.com').parentElement?.parentElement;
    expect(detailsSection).toHaveClass('max-h-24');

    await user.click(screen.getByRole('button'));
    expect(detailsSection).toHaveClass('max-h-0');
  });

  it('rotates chevron when expanded', async () => {
    const user = userEvent.setup();
    render(<PatientCard patient={mockPatient} />);

    const chevron = screen.getByRole('button').querySelector('span svg')?.parentElement;
    expect(chevron).toHaveClass('rotate-180'); // Collapsed: rotated to point down

    await user.click(screen.getByRole('button'));
    expect(chevron).not.toHaveClass('rotate-180'); // Expanded: no rotation, points up
  });

  it('displays email in expanded view', async () => {
    const user = userEvent.setup();
    render(<PatientCard patient={mockPatient} />);

    await user.click(screen.getByRole('button'));
    expect(screen.getByText('john.doe@gmail.com')).toBeInTheDocument();
  });

  it('displays formatted phone in expanded view', async () => {
    const user = userEvent.setup();
    render(<PatientCard patient={mockPatient} />);

    await user.click(screen.getByRole('button'));
    expect(screen.getByText('+1 555 123 4567')).toBeInTheDocument();
  });
});
