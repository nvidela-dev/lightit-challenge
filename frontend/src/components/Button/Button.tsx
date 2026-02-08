import type { ButtonHTMLAttributes, ReactNode } from 'react';
import styles from './Button.module.css';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: ReactNode;
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
    className={`${styles.button} ${styles[variant]} ${styles[size]} ${className}`}
    disabled={disabled || loading}
    {...props}
  >
    {loading ? <span className={styles.spinner} /> : children}
  </button>
);
