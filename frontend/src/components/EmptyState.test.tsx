import { render, screen } from '@testing-library/react';
import { EmptyState } from './EmptyState';

describe('EmptyState', () => {
  it('renders title', () => {
    render(<EmptyState title="No patients found" />);

    expect(screen.getByText('No patients found')).toBeInTheDocument();
  });

  it('renders description when provided', () => {
    render(
      <EmptyState title="No patients" description="Add your first patient to get started" />
    );

    expect(screen.getByText('Add your first patient to get started')).toBeInTheDocument();
  });

  it('renders action when provided', () => {
    render(
      <EmptyState
        title="No patients"
        action={<button>Add Patient</button>}
      />
    );

    expect(screen.getByRole('button', { name: 'Add Patient' })).toBeInTheDocument();
  });

  it('does not render description when not provided', () => {
    const { container } = render(<EmptyState title="No patients" />);

    // Check that no paragraph with description class exists
    expect(container.querySelector('p')).not.toBeInTheDocument();
  });
});
