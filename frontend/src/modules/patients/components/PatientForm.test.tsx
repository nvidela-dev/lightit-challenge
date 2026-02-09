import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PatientForm } from './PatientForm';

const mockOnSubmit = vi.fn();

const createJpgFile = () =>
  new File(['test'], 'test.jpg', { type: 'image/jpeg' });

describe('PatientForm', () => {
  beforeEach(() => {
    mockOnSubmit.mockClear();
    URL.createObjectURL = vi.fn(() => 'blob:test');
  });

  it('renders all form fields', () => {
    render(<PatientForm onSubmit={mockOnSubmit} />);

    expect(screen.getByPlaceholderText('John Doe')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('john.doe@gmail.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('1234567890')).toBeInTheDocument();
    expect(screen.getByText('Document Photo')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Register Patient' })).toBeInTheDocument();
  });

  it('shows no errors before submit attempt', () => {
    render(<PatientForm onSubmit={mockOnSubmit} />);

    expect(screen.queryByText(/must only contain/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/must be a @gmail/i)).not.toBeInTheDocument();
  });

  it('shows validation errors on empty submit', async () => {
    const user = userEvent.setup();
    render(<PatientForm onSubmit={mockOnSubmit} />);

    await user.click(screen.getByRole('button', { name: 'Register Patient' }));

    await waitFor(() => {
      expect(screen.getByText(/must only contain letters and spaces/)).toBeInTheDocument();
    });
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('validates full name contains only letters and spaces', async () => {
    const user = userEvent.setup();
    render(<PatientForm onSubmit={mockOnSubmit} />);

    await user.type(screen.getByPlaceholderText('John Doe'), 'John123');
    await user.click(screen.getByRole('button', { name: 'Register Patient' }));

    await waitFor(() => {
      expect(screen.getByText('Full name must only contain letters and spaces')).toBeInTheDocument();
    });
  });

  it('validates email must be @gmail.com', async () => {
    const user = userEvent.setup();
    render(<PatientForm onSubmit={mockOnSubmit} />);

    await user.type(screen.getByPlaceholderText('john.doe@gmail.com'), 'test@yahoo.com');
    await user.click(screen.getByRole('button', { name: 'Register Patient' }));

    await waitFor(() => {
      expect(screen.getByText('Email must be a @gmail.com address')).toBeInTheDocument();
    });
  });

  it('validates phone number format', async () => {
    const user = userEvent.setup();
    render(<PatientForm onSubmit={mockOnSubmit} />);

    const phoneInput = screen.getByPlaceholderText('1234567890');
    await user.type(phoneInput, '123');
    await user.click(screen.getByRole('button', { name: 'Register Patient' }));

    await waitFor(() => {
      expect(screen.getByText('Phone number must be 6-15 digits')).toBeInTheDocument();
    });
  });

  it('shows document required error when file missing', async () => {
    const user = userEvent.setup();
    render(<PatientForm onSubmit={mockOnSubmit} />);

    await user.type(screen.getByPlaceholderText('John Doe'), 'John Doe');
    await user.type(screen.getByPlaceholderText('john.doe@gmail.com'), 'john@gmail.com');
    await user.type(screen.getByPlaceholderText('1234567890'), '1234567890');
    await user.click(screen.getByRole('button', { name: 'Register Patient' }));

    await waitFor(() => {
      expect(screen.getByText('Document photo is required')).toBeInTheDocument();
    });
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('clears errors in real-time after first submit attempt', async () => {
    const user = userEvent.setup();
    render(<PatientForm onSubmit={mockOnSubmit} />);

    await user.click(screen.getByRole('button', { name: 'Register Patient' }));
    await waitFor(() => {
      expect(screen.getByText(/must only contain letters and spaces/)).toBeInTheDocument();
    });

    await user.type(screen.getByPlaceholderText('John Doe'), 'John Doe');
    await waitFor(() => {
      expect(screen.queryByText(/must only contain letters and spaces/)).not.toBeInTheDocument();
    });
  });

  it('submits form with valid data and file', async () => {
    const user = userEvent.setup();
    render(<PatientForm onSubmit={mockOnSubmit} />);

    await user.type(screen.getByPlaceholderText('John Doe'), 'John Doe');
    await user.type(screen.getByPlaceholderText('john.doe@gmail.com'), 'john@gmail.com');
    await user.type(screen.getByPlaceholderText('1234567890'), '1234567890');

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    await user.upload(fileInput, createJpgFile());

    await user.click(screen.getByRole('button', { name: 'Register Patient' }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    });

    const formData = mockOnSubmit.mock.calls[0][0] as FormData;
    expect(formData.get('fullName')).toBe('John Doe');
    expect(formData.get('email')).toBe('john@gmail.com');
    expect(formData.get('phoneNumber')).toBe('1234567890');
    expect(formData.get('document')).toBeInstanceOf(File);
  });
});
