import type { ReactNode } from 'react';
import styles from './EmptyState.module.css';

type EmptyStateProps = {
  title: string;
  description?: string;
  action?: ReactNode;
};

export const EmptyState = ({ title, description, action }: EmptyStateProps) => (
  <div className={styles.container}>
    <div className={styles.icon}>
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
        <circle cx="32" cy="32" r="30" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
        <path
          d="M24 28a4 4 0 1 1 8 0M32 28a4 4 0 1 1 8 0M22 40s4 4 10 4 10-4 10-4"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </div>
    <h3 className={styles.title}>{title}</h3>
    {description && <p className={styles.description}>{description}</p>}
    {action && <div className={styles.action}>{action}</div>}
  </div>
);
