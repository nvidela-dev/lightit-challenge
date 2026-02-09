import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

// Mock child components to simplify testing
vi.mock('./components/Header', () => ({
  Header: () => <header data-testid="header">Header</header>,
}));

vi.mock('./components/Footer', () => ({
  Footer: () => <footer data-testid="footer">Footer</footer>,
}));

vi.mock('./components/HeroSection', () => ({
  HeroSection: ({ isCollapsed, onCollapseChange }: { isCollapsed: boolean; onCollapseChange: (v: boolean) => void }) => (
    <div data-testid="hero" data-collapsed={isCollapsed}>
      <button onClick={() => onCollapseChange(!isCollapsed)}>Toggle Hero</button>
    </div>
  ),
}));

vi.mock('./modules/patients/PatientPage', () => ({
  PatientPage: ({ isHeroCollapsed, onToggleCollapse }: { isHeroCollapsed: boolean; onToggleCollapse: () => void }) => (
    <div data-testid="patient-page" data-hero-collapsed={isHeroCollapsed}>
      <button onClick={onToggleCollapse}>Toggle From Page</button>
    </div>
  ),
}));

describe('App', () => {
  it('renders header, hero, patient page, and footer', () => {
    render(<App />);

    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('hero')).toBeInTheDocument();
    expect(screen.getByTestId('patient-page')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  it('starts with hero not collapsed', () => {
    render(<App />);

    expect(screen.getByTestId('hero')).toHaveAttribute('data-collapsed', 'false');
    expect(screen.getByTestId('patient-page')).toHaveAttribute('data-hero-collapsed', 'false');
  });

  it('toggles hero collapse state from HeroSection', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'Toggle Hero' }));

    expect(screen.getByTestId('hero')).toHaveAttribute('data-collapsed', 'true');
    expect(screen.getByTestId('patient-page')).toHaveAttribute('data-hero-collapsed', 'true');
  });

  it('toggles hero collapse state from PatientPage', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'Toggle From Page' }));

    expect(screen.getByTestId('hero')).toHaveAttribute('data-collapsed', 'true');
  });
});
