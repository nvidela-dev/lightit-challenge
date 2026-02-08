import type { ReactNode } from 'react';
import styles from './FormField.module.css';

type FormFieldProps = {
  label: string;
  error?: string;
  children: ReactNode;
};

export const FormField = ({ label, error, children }: FormFieldProps) => (
  <div className={styles.field}>
    <label className={styles.label}>{label}</label>
    {children}
    <div className={`${styles.errorContainer} ${error ? styles.hasError : ''}`}>
      <span className={styles.error}>{error}</span>
    </div>
  </div>
);
