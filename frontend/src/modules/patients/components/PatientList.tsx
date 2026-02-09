import type { Patient } from '../types';
import { PatientCard } from './PatientCard';

type PatientListProps = {
  patients: Patient[];
  isLoading?: boolean;
  skeletonCount?: number;
};

const SkeletonCard = () => (
  <div className="glass-card rounded-xl p-4">
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 bg-slate-200/60 rounded-md animate-pulse-slow flex-shrink-0" />
      <div className="flex-1 flex flex-col gap-2">
        <div className="w-3/5 h-4 bg-slate-200/60 rounded animate-pulse-slow" />
        <div className="w-2/5 h-3 bg-slate-200/60 rounded animate-pulse-slow" />
      </div>
      <div className="w-7 h-7 bg-slate-200/40 rounded-full animate-pulse-slow" />
    </div>
  </div>
);

export const PatientList = ({ patients, isLoading = false, skeletonCount = 9 }: PatientListProps) => (
  <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4 items-start">
    {isLoading
      ? Array.from({ length: skeletonCount }, (_, i) => <SkeletonCard key={i} />)
      : patients.map((patient) => <PatientCard key={patient.id} patient={patient} />)}
  </div>
);
