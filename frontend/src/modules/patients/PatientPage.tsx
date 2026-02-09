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
    <section className="py-8">
      <div className="glass-section rounded-2xl p-6 md:p-8">
        <header className="flex items-center justify-between gap-4 mb-6 max-sm:flex-col max-sm:items-stretch">
          <h2 className="text-xl font-semibold text-slate-800 max-sm:text-lg max-sm:text-center">
            Registered Patients
          </h2>
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
      </div>

      <RegistrationModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </section>
  );
};
