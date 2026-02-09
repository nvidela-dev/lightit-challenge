import { Toast as ToastType, ToastType as ToastVariant } from '../contexts/ToastContext';
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

const colorMap: Record<ToastVariant, string> = {
  success: 'text-green-500',
  error: 'text-red-500',
  info: 'text-blue-500',
  warning: 'text-amber-500',
};

const borderMap: Record<ToastVariant, string> = {
  success: 'border-l-green-500',
  error: 'border-l-red-500',
  info: 'border-l-blue-500',
  warning: 'border-l-amber-500',
};

export const Toast = ({ toast, onDismiss }: ToastProps) => {
  const Icon = iconMap[toast.type];

  return (
    <div
      role="alert"
      className={`
        glass-toast flex items-start gap-3 p-4 rounded-lg shadow-lg
        border-l-4 ${borderMap[toast.type]}
        animate-toast-in
        min-w-[300px] max-w-[400px]
      `}
    >
      <Icon className={`w-5 h-5 flex-shrink-0 ${colorMap[toast.type]}`} />
      <p className="flex-1 text-sm text-slate-700">{toast.message}</p>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        className="flex-shrink-0 text-slate-400 hover:text-slate-600 transition-colors"
        aria-label="Dismiss"
      >
        <XIcon className="w-4 h-4" />
      </button>
    </div>
  );
};
