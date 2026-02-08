import type { Patient } from '../../types';
import { PatientCard } from '../PatientCard';
import styles from './PatientList.module.css';

type PatientListProps = {
  patients: Patient[];
  isLoading?: boolean;
};

const SkeletonCard = () => (
  <div className={styles.skeleton}>
    <div className={styles.skeletonPhoto} />
    <div className={styles.skeletonContent}>
      <div className={styles.skeletonName} />
      <div className={styles.skeletonDate} />
    </div>
  </div>
);

export const PatientList = ({ patients, isLoading = false }: PatientListProps) => (
  <div className={styles.grid}>
    {isLoading
      ? Array.from({ length: 3 }, (_, i) => <SkeletonCard key={i} />)
      : patients.map((patient) => <PatientCard key={patient.id} patient={patient} />)}
  </div>
);
