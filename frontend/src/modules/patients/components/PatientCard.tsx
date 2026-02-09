import { useState, useCallback } from 'react';
import type { Patient } from '../types';

type PatientCardProps = {
  patient: Patient;
};

const formatDate = (dateString: string): string =>
  new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

const formatPhone = (code: string, number: string): string =>
  `${code} ${number.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3')}`;

export const PatientCard = ({ patient }: PatientCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  return (
    <article
      className="glass-card rounded-xl overflow-hidden cursor-pointer transition-all duration-150 hover:shadow-xl hover:-translate-y-1 hover:bg-white"
      onClick={toggleExpand}
      onKeyDown={(e) => e.key === 'Enter' && toggleExpand()}
      role="button"
      tabIndex={0}
      aria-expanded={isExpanded}
    >
      <div className="flex items-center gap-3 p-4">
        <img
          src={patient.documentUrl}
          alt={`${patient.fullName}'s document`}
          className="w-12 h-12 object-cover rounded-md flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <h3 className="text-[15px] font-semibold text-slate-900 truncate">{patient.fullName}</h3>
          <p className="text-sm text-slate-500 mt-0.5">{formatDate(patient.createdAt)}</p>
        </div>
        <span
          className={`flex items-center justify-center w-7 h-7 text-slate-400 transition-transform duration-200 ${
            isExpanded ? 'rotate-180' : ''
          }`}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M6 8l4 4 4-4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>
      <div
        className={`flex flex-col gap-2 overflow-hidden transition-all duration-200 ${
          isExpanded ? 'max-h-24 opacity-100 px-4 pb-4' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="flex justify-between gap-3">
          <span className="text-sm text-slate-500">Email</span>
          <span className="text-sm text-slate-900 text-right truncate">{patient.email}</span>
        </div>
        <div className="flex justify-between gap-3">
          <span className="text-sm text-slate-500">Phone</span>
          <span className="text-sm text-slate-900 text-right">
            {formatPhone(patient.phoneCode, patient.phoneNumber)}
          </span>
        </div>
      </div>
    </article>
  );
};
