import { createPortal } from 'react-dom';
import { useToast } from '../hooks/useToast';
import { Toast } from './Toast';

export const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  const toastRoot = document.getElementById('toast-root');
  if (!toastRoot) return null;

  return createPortal(
    <div
      aria-live="polite"
      aria-label="Notifications"
      className="fixed top-20 right-6 z-50 flex flex-col gap-3"
    >
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onDismiss={removeToast} />
      ))}
    </div>,
    toastRoot
  );
};
