import type { ReactNode } from 'react';

type EmptyStateProps = {
  title: string;
  description?: string;
  action?: ReactNode;
};

export const EmptyState = ({ title, description, action }: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center py-16 px-5 text-center">
    <div className="text-slate-400 mb-4">
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
    <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
    {description && <p className="mt-2 text-sm text-slate-500 max-w-xs">{description}</p>}
    {action && <div className="mt-6">{action}</div>}
  </div>
);
