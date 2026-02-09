import { render, screen } from '@testing-library/react';
import { ToastContainer } from './ToastContainer';
import { ToastProvider } from '../contexts/ToastProvider';

describe('ToastContainer', () => {
  let toastRoot: HTMLDivElement;

  beforeEach(() => {
    toastRoot = document.createElement('div');
    toastRoot.id = 'toast-root';
    document.body.appendChild(toastRoot);
  });

  afterEach(() => {
    document.body.removeChild(toastRoot);
  });

  it('renders nothing when toast-root does not exist', () => {
    document.body.removeChild(toastRoot);

    const { container } = render(
      <ToastProvider>
        <ToastContainer />
      </ToastProvider>
    );

    expect(container).toBeEmptyDOMElement();

    // Re-add for cleanup
    document.body.appendChild(toastRoot);
  });

  it('renders toasts in portal', () => {
    render(
      <ToastProvider>
        <ToastContainer />
      </ToastProvider>
    );

    expect(toastRoot.querySelector('[aria-live="polite"]')).toBeInTheDocument();
  });
});
