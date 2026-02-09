import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ToastProvider } from './contexts/ToastContext';
import { ToastContainer } from './components/ToastContainer';
import { DebugProvider } from './contexts/DebugContext';
import { DebugDrawer } from './components/DebugDrawer';
import './styles/globals.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
      retry: 1,
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <DebugProvider>
        <QueryClientProvider client={queryClient}>
          <ToastProvider>
            <App />
            <ToastContainer />
            <DebugDrawer />
          </ToastProvider>
        </QueryClientProvider>
      </DebugProvider>
    </ErrorBoundary>
  </StrictMode>
);
