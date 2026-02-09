import { Toast as ToastType, ToastType as ToastVariant } from '../contexts/toastContext';
import { CheckCircleIcon, XCircleIcon, InfoIcon, WarningIcon, XIcon } from './icons';

type ToastProps = {
  toast: ToastType;
  onDismiss: (id: string) => void;
};

const iconMap: Record<ToastVariant, typeof CheckCircleIcon> = {
  success: CheckCircleIcon,
  error: XCircleIcon,
  info: InfoIcon,
  warning: WarningIcon,
};

const iconColorMap: Record<ToastVariant, string> = {
  success: 'text-green-700',
  error: 'text-red-700',
  info: 'text-blue-700',
  warning: 'text-amber-700',
};

const textColorMap: Record<ToastVariant, string> = {
  success: 'text-green-800',
  error: 'text-red-800',
  info: 'text-slate-700',
  warning: 'text-amber-800',
};

const dismissColorMap: Record<ToastVariant, string> = {
  success: 'text-green-600/60 hover:text-green-700',
  error: 'text-red-600/60 hover:text-red-700',
  info: 'text-slate-400 hover:text-slate-600',
  warning: 'text-amber-600/60 hover:text-amber-700',
};

export const Toast = ({ toast, onDismiss }: ToastProps) => {
  const Icon = iconMap[toast.type];
  const glassClass = toast.type === 'success' ? 'glass-toast-success'
    : toast.type === 'error' ? 'glass-toast-error'
    : toast.type === 'warning' ? 'glass-toast-warning'
    : 'glass-toast';

  return (
    <div
      role="alert"
      className={`
        ${glassClass} flex items-start gap-3 p-4 rounded-xl shadow-lg
        animate-toast-in
        min-w-[300px] max-w-[400px]
      `}
    >
      <Icon className={`w-5 h-5 flex-shrink-0 ${iconColorMap[toast.type]}`} />
      <p className={`flex-1 text-sm ${textColorMap[toast.type]}`}>{toast.message}</p>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        className={`flex-shrink-0 transition-colors ${dismissColorMap[toast.type]}`}
        aria-label="Dismiss"
      >
        <XIcon className="w-4 h-4" />
      </button>
    </div>
  );
};
