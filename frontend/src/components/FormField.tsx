import type { ReactNode } from 'react';

type FormFieldProps = {
  label: string;
  error?: string;
  children: ReactNode;
};

export const FormField = ({ label, error, children }: FormFieldProps) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-sm font-medium text-slate-900">{label}</label>
    <div className="[&>input]:w-full [&>input]:px-3.5 [&>input]:py-2.5 [&>input]:text-sm [&>input]:border [&>input]:border-slate-200 [&>input]:rounded-lg [&>input]:bg-white [&>input]:text-slate-900 [&>input]:transition-all [&>input]:duration-150 [&>input]:focus:outline-none [&>input]:focus:border-primary [&>input]:focus:ring-[3px] [&>input]:focus:ring-primary/10 [&>input]:placeholder:text-slate-400">
      {children}
    </div>
    <div
      className={`overflow-hidden transition-all duration-250 ${
        error ? 'max-h-6 opacity-100' : 'max-h-0 opacity-0'
      }`}
    >
      <span className="text-sm text-red-600">{error}</span>
    </div>
  </div>
);
