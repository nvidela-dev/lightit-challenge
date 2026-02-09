import { useState, useCallback } from 'react';
import { Modal } from '../../../components/Modal';
import { Button } from '../../../components/Button';
import { PatientForm } from './PatientForm';
import { useCreatePatient } from '../hooks/useCreatePatient';
import { ApiError } from '../../../api/client';

type RegistrationModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

type ModalState = 'form' | 'loading' | 'success' | 'error';

export const RegistrationModal = ({ isOpen, onClose }: RegistrationModalProps) => {
  const [state, setState] = useState<ModalState>('form');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const { mutateAsync } = useCreatePatient();

  const handleSubmit = useCallback(
    async (formData: FormData) => {
      setState('loading');
      setErrorMessage('');

      try {
        await mutateAsync(formData);
        setState('success');
      } catch (err) {
        const message =
          err instanceof ApiError
            ? typeof err.errors === 'string'
              ? err.errors
              : Object.values(err.errors).join(', ')
            : 'An unexpected error occurred';
        setErrorMessage(message);
        setState('error');
      }
    },
    [mutateAsync]
  );

  const handleClose = useCallback(() => {
    onClose();
    setTimeout(() => {
      setState('form');
      setErrorMessage('');
    }, 300);
  }, [onClose]);

  const handleRetry = useCallback(() => {
    setState('form');
  }, []);

  const renderContent = () => {
    switch (state) {
      case 'loading':
        return (
          <div className="flex flex-col items-center justify-center py-10 px-5 text-center animate-fade-in">
            <div className="w-12 h-12 border-3 border-slate-200 border-t-primary rounded-full animate-spin-fast" />
            <p className="mt-4 text-[15px] text-slate-900">Registering patient...</p>
          </div>
        );

      case 'success':
        return (
          <div className="flex flex-col items-center justify-center py-10 px-5 text-center animate-fade-in">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-600/10 text-green-600">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path
                  d="M8 16l6 6 10-12"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <p className="mt-4 text-[15px] text-slate-900">Patient registered successfully!</p>
            <Button onClick={handleClose} className="mt-6 min-w-[120px]">
              Close
            </Button>
          </div>
        );

      case 'error':
        return (
          <div className="flex flex-col items-center justify-center py-10 px-5 text-center animate-fade-in">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-600/10 text-red-600">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path
                  d="M10 10l12 12M22 10L10 22"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <p className="mt-4 text-[15px] text-slate-900">{errorMessage}</p>
            <Button onClick={handleRetry} className="mt-6 min-w-[120px]">
              Try Again
            </Button>
          </div>
        );

      case 'form':
        return <PatientForm onSubmit={handleSubmit} />;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Register New Patient"
      preventClose={state === 'loading'}
    >
      {renderContent()}
    </Modal>
  );
};
