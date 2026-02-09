import { useState, useCallback } from 'react';
import { Button } from '../../components/Button';
import { EmptyState } from '../../components/EmptyState';
import { usePatients } from './hooks/usePatients';
import { PatientList } from './components/PatientList';
import { RegistrationModal } from './components/RegistrationModal';

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
    <div className="py-8">
      <header className="flex items-center justify-between gap-4 mb-8 max-sm:flex-col max-sm:items-stretch">
        <h1 className="text-3xl font-bold text-slate-900 max-sm:text-2xl max-sm:text-center">
          Patient Registration
        </h1>
        <Button onClick={handleOpenModal}>Add Patient</Button>
      </header>

      {isError && (
        <div className="p-4 mb-6 bg-red-600/10 border border-red-600 rounded-lg text-red-600 text-sm">
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
