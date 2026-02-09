import type { Patient } from '../types';
import { PatientCard } from './PatientCard';

type PatientListProps = {
  patients: Patient[];
  isLoading?: boolean;
};

const SkeletonCard = () => (
  <div className="flex items-center gap-3 p-4 bg-white border border-slate-200 rounded-lg">
    <div className="w-12 h-12 bg-slate-100 rounded-md animate-pulse-slow" />
    <div className="flex-1 flex flex-col gap-2">
      <div className="w-3/5 h-4 bg-slate-100 rounded animate-pulse-slow" />
      <div className="w-2/5 h-3 bg-slate-100 rounded animate-pulse-slow" />
    </div>
  </div>
);

export const PatientList = ({ patients, isLoading = false }: PatientListProps) => (
  <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4 items-start">
    {isLoading
      ? Array.from({ length: 3 }, (_, i) => <SkeletonCard key={i} />)
      : patients.map((patient) => <PatientCard key={patient.id} patient={patient} />)}
  </div>
);
