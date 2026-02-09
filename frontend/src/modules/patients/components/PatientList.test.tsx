import { render, screen } from '@testing-library/react';
import { PatientList } from './PatientList';
import type { Patient } from '../types';

const mockPatients: Patient[] = [
  {
    id: '1',
    fullName: 'John Doe',
    email: 'john@gmail.com',
    phoneCode: '+1',
    phoneNumber: '1234567890',
    documentUrl: '/uploads/doc1.jpg',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    fullName: 'Jane Smith',
    email: 'jane@gmail.com',
    phoneCode: '+1',
    phoneNumber: '0987654321',
    documentUrl: '/uploads/doc2.jpg',
    createdAt: new Date().toISOString(),
  },
];

describe('PatientList', () => {
  it('renders patient cards when not loading', () => {
    render(<PatientList patients={mockPatients} />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });

  it('renders skeleton cards when loading', () => {
    const { container } = render(<PatientList patients={[]} isLoading skeletonCount={3} />);

    const skeletons = container.querySelectorAll('.animate-pulse-slow');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('uses default skeleton count of 9', () => {
    const { container } = render(<PatientList patients={[]} isLoading />);

    // Each skeleton has multiple animated elements, so we check the parent elements
    const skeletonCards = container.querySelectorAll('.glass-card');
    expect(skeletonCards).toHaveLength(9);
  });

  it('renders empty list when no patients', () => {
    const { container } = render(<PatientList patients={[]} />);

    // Grid should be empty
    const grid = container.querySelector('.grid');
    expect(grid?.children).toHaveLength(0);
  });
});
