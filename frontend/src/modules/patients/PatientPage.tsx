import { useState, useCallback, useMemo } from 'react';
import { Button } from '../../components/Button';
import { EmptyState } from '../../components/EmptyState';
import { Pagination } from '../../components/Pagination';
import { usePatients } from './hooks/usePatients';
import { PatientList } from './components/PatientList';
import { RegistrationModal } from './components/RegistrationModal';

const ITEMS_PER_PAGE = 6;

export const PatientPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading, isError } = usePatients();

  const handleOpenModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const allPatients = useMemo(() => data?.data ?? [], [data?.data]);
  const isEmpty = !isLoading && allPatients.length === 0;

  const totalPages = Math.ceil(allPatients.length / ITEMS_PER_PAGE);
  const paginatedPatients = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return allPatients.slice(start, start + ITEMS_PER_PAGE);
  }, [allPatients, currentPage]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  return (
    <section className="flex flex-col flex-1">
      <div className="glass-section rounded-2xl p-6 md:p-8 flex-1 flex flex-col">
        <header className="flex items-center justify-between gap-4 mb-6 max-sm:flex-col max-sm:items-stretch">
          <h2 className="text-xl font-semibold text-slate-800 max-sm:text-lg max-sm:text-center">
            Registered Patients
            {allPatients.length > 0 && (
              <span className="ml-2 text-sm font-normal text-slate-500">
                ({allPatients.length})
              </span>
            )}
          </h2>
          <Button onClick={handleOpenModal}>Add Patient</Button>
        </header>

        {isError && (
          <div className="p-4 mb-6 bg-red-600/10 border border-red-600 rounded-lg text-red-600 text-sm">
            Failed to load patients. Please try again later.
          </div>
        )}

        <div className="flex-1">
          {isEmpty ? (
            <EmptyState
              title="No patients yet"
              description="Get started by registering your first patient"
              action={<Button onClick={handleOpenModal}>Add Patient</Button>}
            />
          ) : (
            <PatientList patients={paginatedPatients} isLoading={isLoading} />
          )}
        </div>

        {totalPages > 1 && (
          <footer className="mt-6 pt-6 border-t border-slate-200/50">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </footer>
        )}
      </div>

      <RegistrationModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </section>
  );
};
