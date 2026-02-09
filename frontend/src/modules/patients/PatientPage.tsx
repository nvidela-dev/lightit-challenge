import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { Button } from '../../components/Button';
import { EmptyState } from '../../components/EmptyState';
import { Pagination } from '../../components/Pagination';
import { PlusIcon, ChevronUpIcon } from '../../components/icons';
import { usePatients } from './hooks/usePatients';
import { PatientList } from './components/PatientList';
import { RegistrationModal } from './components/RegistrationModal';
import { useToast } from '../../hooks/useToast';

const BACKEND_PAGE_SIZE = 18;
const EXPANDED_PAGE_SIZE = 9;

type PatientPageProps = {
  isHeroCollapsed: boolean;
  onToggleCollapse: () => void;
};

export const PatientPage = ({ isHeroCollapsed, onToggleCollapse }: PatientPageProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [visualPage, setVisualPage] = useState(1);
  const { addToast } = useToast();
  const hasShownError = useRef(false);

  const backendPage = isHeroCollapsed ? visualPage : Math.ceil(visualPage / 2);
  const { data, isLoading, isFetching, isError } = usePatients({ page: backendPage, limit: BACKEND_PAGE_SIZE });
  const showSkeleton = isLoading || isFetching || isError;

  // Reset to page 1 when collapse state changes
  useEffect(() => {
    setVisualPage(1);
  }, [isHeroCollapsed]);

  // Show error toast when fetch fails
  useEffect(() => {
    if (isError && !hasShownError.current) {
      addToast({ type: 'error', message: 'Failed to load patients. Please try again later.' });
      hasShownError.current = true;
    }
    if (!isError) {
      hasShownError.current = false;
    }
  }, [isError, addToast]);

  // Calculate visible patients based on collapsed state
  const visiblePatients = useMemo(() => {
    const allPatients = data?.data ?? [];
    if (isHeroCollapsed) {
      return allPatients;
    }
    // When expanded, show first or second half based on odd/even visual page
    const isFirstHalf = visualPage % 2 === 1;
    return isFirstHalf
      ? allPatients.slice(0, EXPANDED_PAGE_SIZE)
      : allPatients.slice(EXPANDED_PAGE_SIZE);
  }, [data?.data, isHeroCollapsed, visualPage]);

  // Calculate total visual pages based on total items
  const totalVisualPages = useMemo(() => {
    const total = data?.pagination?.total ?? 0;
    if (isHeroCollapsed) {
      return Math.ceil(total / BACKEND_PAGE_SIZE) || 1;
    }
    return Math.ceil(total / EXPANDED_PAGE_SIZE) || 1;
  }, [data?.pagination?.total, isHeroCollapsed]);

  const handleOpenModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setVisualPage(page);
  }, []);

  const total = data?.pagination?.total ?? 0;
  const isEmpty = !showSkeleton && !isError && visiblePatients.length === 0;
  const skeletonCount = isHeroCollapsed ? BACKEND_PAGE_SIZE : EXPANDED_PAGE_SIZE;

  return (
    <section className="flex flex-col">
      <div
        className={`glass-section rounded-2xl p-6 md:p-8 flex flex-col transition-all duration-1000 ease-out ${
          isHeroCollapsed ? '-translate-y-6' : 'translate-y-0'
        }`}
      >
        <header className="flex items-center justify-between gap-4 mb-6 max-sm:flex-col max-sm:items-stretch">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold text-slate-800 max-sm:text-lg max-sm:text-center">
              Patients
              <span className="ml-2 text-sm font-normal text-slate-500">
                ({total})
              </span>
            </h2>
            <div className="relative group">
              <button
                type="button"
                onClick={onToggleCollapse}
                className="flex items-center justify-center w-5 h-5 rounded-full bg-slate-200/60 hover:bg-slate-300/80 text-slate-500 transition-all duration-300"
                aria-label={isHeroCollapsed ? 'Show banner' : 'Hide banner'}
              >
                <ChevronUpIcon
                  width="10"
                  height="10"
                  className={`transition-transform duration-300 ${isHeroCollapsed ? 'rotate-180' : ''}`}
                />
              </button>
              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-2 py-1.5 bg-slate-800 text-white text-[10px] rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-10">
                {isHeroCollapsed ? 'Collapse' : 'Expand'}
                <span className="block text-slate-400 mt-0.5">
                  Scroll outside list to toggle
                </span>
                <div className="absolute left-1/2 -translate-x-1/2 -top-1 w-1.5 h-1.5 bg-slate-800 rotate-45" />
              </div>
            </div>
          </div>
          <Button onClick={handleOpenModal}>
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-white/20">
              <PlusIcon width="12" height="12" />
            </span>
            Add Patient
          </Button>
        </header>

        <div
          data-scroll-container
          className={`overflow-y-auto ${isHeroCollapsed ? 'h-[600px]' : 'h-[280px]'}`}
        >
          {isEmpty ? (
            <EmptyState
              title="No patients yet"
              description="Get started by registering your first patient"
              action={(
                <Button onClick={handleOpenModal}>
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-white/20">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M6 2v8M2 6h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </span>
                  Add Patient
                </Button>
              )}
            />
          ) : (
            <PatientList patients={visiblePatients} isLoading={showSkeleton} skeletonCount={skeletonCount} />
          )}
        </div>

        <footer className="mt-auto pt-6 border-t border-slate-200/50">
          <Pagination
            currentPage={visualPage}
            totalPages={totalVisualPages}
            onPageChange={handlePageChange}
          />
        </footer>
      </div>

      <RegistrationModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </section>
  );
};
