import type { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: ReactNode;
};

const variantStyles = {
  primary: 'glass-button text-white',
  secondary: 'glass text-slate-900 hover:bg-white/90',
};

const sizeStyles = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-6 py-3.5 text-base',
};

export const Button = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  children,
  className = '',
  ...props
}: ButtonProps) => (
  <button
    type="button"
    className={`inline-flex items-center justify-center gap-2 font-medium rounded-lg cursor-pointer transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    disabled={disabled || loading}
    {...props}
  >
    {loading ? (
      <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin-fast" />
    ) : (
      children
    )}
  </button>
);
