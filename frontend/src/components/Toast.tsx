import { Toast as ToastType, ToastType as ToastVariant } from '../contexts/toastContext';
import { CheckCircleIcon, XCircleIcon, InfoIcon, WarningIcon, XIcon } from './icons';

type ToastProps = {
  toast: ToastType;
  onDismiss: (id: string) => void;
};

const toastConfig: Record<ToastVariant, {
  icon: typeof CheckCircleIcon;
  iconColor: string;
  textColor: string;
  dismissColor: string;
  glassClass: string;
}> = {
  success: {
    icon: CheckCircleIcon,
    iconColor: 'text-green-700',
    textColor: 'text-green-800',
    dismissColor: 'text-green-600/60 hover:text-green-700',
    glassClass: 'glass-toast-success',
  },
  error: {
    icon: XCircleIcon,
    iconColor: 'text-red-700',
    textColor: 'text-red-800',
    dismissColor: 'text-red-600/60 hover:text-red-700',
    glassClass: 'glass-toast-error',
  },
  info: {
    icon: InfoIcon,
    iconColor: 'text-blue-700',
    textColor: 'text-slate-700',
    dismissColor: 'text-slate-400 hover:text-slate-600',
    glassClass: 'glass-toast',
  },
  warning: {
    icon: WarningIcon,
    iconColor: 'text-amber-700',
    textColor: 'text-amber-800',
    dismissColor: 'text-amber-600/60 hover:text-amber-700',
    glassClass: 'glass-toast-warning',
  },
};

export const Toast = ({ toast, onDismiss }: ToastProps) => {
  const { icon: Icon, iconColor, textColor, dismissColor, glassClass } = toastConfig[toast.type];

  return (
    <div
      role="alert"
      className={`
        ${glassClass} flex items-start gap-3 p-4 rounded-xl shadow-lg
        animate-toast-in
        min-w-[300px] max-w-[400px]
      `}
    >
      <Icon className={`w-5 h-5 flex-shrink-0 ${iconColor}`} />
      <p className={`flex-1 text-sm ${textColor}`}>{toast.message}</p>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        className={`flex-shrink-0 transition-colors ${dismissColor}`}
        aria-label="Dismiss"
      >
        <XIcon className="w-4 h-4" />
      </button>
    </div>
  );
};
