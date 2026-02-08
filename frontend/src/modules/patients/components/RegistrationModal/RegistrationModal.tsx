import { useState, useCallback } from 'react';
import { Modal } from '../../../../components/Modal';
import { Button } from '../../../../components/Button';
import { PatientForm } from '../PatientForm';
import { useCreatePatient } from '../../hooks';
import { ApiError } from '../../../../api/client';
import styles from './RegistrationModal.module.css';

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
          <div className={styles.stateContainer}>
            <div className={styles.spinner} />
            <p className={styles.stateText}>Registering patient...</p>
          </div>
        );

      case 'success':
        return (
          <div className={styles.stateContainer}>
            <div className={`${styles.icon} ${styles.successIcon}`}>
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
            <p className={styles.stateText}>Patient registered successfully!</p>
            <Button onClick={handleClose} className={styles.stateButton}>
              Close
            </Button>
          </div>
        );

      case 'error':
        return (
          <div className={styles.stateContainer}>
            <div className={`${styles.icon} ${styles.errorIcon}`}>
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path
                  d="M10 10l12 12M22 10L10 22"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <p className={styles.stateText}>{errorMessage}</p>
            <Button onClick={handleRetry} className={styles.stateButton}>
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
