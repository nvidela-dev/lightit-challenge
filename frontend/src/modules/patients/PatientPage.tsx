import { useState, useCallback } from 'react';
import { Button } from '../../components/Button';
import { EmptyState } from '../../components/EmptyState';
import { usePatients } from './hooks';
import { PatientList } from './components/PatientList';
import { RegistrationModal } from './components/RegistrationModal';
import styles from './PatientPage.module.css';

export const PatientPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data, isLoading, isError } = usePatients();

  const handleOpenModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const patients = data?.data ?? [];
  const isEmpty = !isLoading && patients.length === 0;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Patient Registration</h1>
        <Button onClick={handleOpenModal}>Add Patient</Button>
      </header>

      {isError && (
        <div className={styles.error}>
          Failed to load patients. Please try again later.
        </div>
      )}

      {isEmpty ? (
        <EmptyState
          title="No patients yet"
          description="Get started by registering your first patient"
          action={<Button onClick={handleOpenModal}>Add Patient</Button>}
        />
      ) : (
        <PatientList patients={patients} isLoading={isLoading} />
      )}

      <RegistrationModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
};
