import { useState, useCallback } from 'react';
import type { Patient } from '../../types';
import styles from './PatientCard.module.css';

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
      className={`${styles.card} ${isExpanded ? styles.expanded : ''}`}
      onClick={toggleExpand}
    >
      <div className={styles.header}>
        <img
          src={patient.documentUrl}
          alt={`${patient.fullName}'s document`}
          className={styles.photo}
        />
        <div className={styles.info}>
          <h3 className={styles.name}>{patient.fullName}</h3>
          <p className={styles.date}>{formatDate(patient.createdAt)}</p>
        </div>
        <span className={styles.chevron}>
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
      <div className={styles.details}>
        <div className={styles.detailRow}>
          <span className={styles.detailLabel}>Email</span>
          <span className={styles.detailValue}>{patient.email}</span>
        </div>
        <div className={styles.detailRow}>
          <span className={styles.detailLabel}>Phone</span>
          <span className={styles.detailValue}>
            {formatPhone(patient.phoneCode, patient.phoneNumber)}
          </span>
        </div>
      </div>
    </article>
  );
};
