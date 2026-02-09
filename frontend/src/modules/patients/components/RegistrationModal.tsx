import { useState, useCallback } from 'react';
import { Modal } from '../../../components/Modal';
import { PatientForm } from './PatientForm';
import { useCreatePatient } from '../hooks/usePatients';
import { ApiError, NetworkError } from '../../../api/client';
import { useToast } from '../../../hooks/useToast';

type RegistrationModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

type ModalState = 'form' | 'loading';

export const RegistrationModal = ({ isOpen, onClose }: RegistrationModalProps) => {
  const [state, setState] = useState<ModalState>('form');
  const { mutateAsync } = useCreatePatient();
  const { addToast } = useToast();

  const handleSubmit = useCallback(
    async (formData: FormData) => {
      setState('loading');

      try {
        await mutateAsync(formData);
        const email = formData.get('email') as string;
        addToast({ type: 'success', message: `Email sent to ${email}` });
        onClose();
        setTimeout(() => setState('form'), 300);
      } catch (err) {
        let message = 'An unexpected error occurred';

        if (err instanceof NetworkError) {
          message = err.message;
        } else if (err instanceof ApiError) {
          message = typeof err.errors === 'string'
            ? err.errors
            : Object.values(err.errors).join(', ');
        }

        addToast({ type: 'error', message });
        setState('form');
      }
    },
    [mutateAsync, addToast, onClose]
  );

  const handleClose = useCallback(() => {
    onClose();
    setTimeout(() => setState('form'), 300);
  }, [onClose]);

  const renderContent = () => {
    if (state === 'loading') {
      return (
        <div className="flex flex-col items-center justify-center py-10 px-5 text-center animate-fade-in">
          <div className="w-12 h-12 border-3 border-slate-200 border-t-primary rounded-full animate-spin-fast" />
          <p className="mt-4 text-[15px] text-slate-900">Registering patient...</p>
        </div>
      );
    }
    return <PatientForm onSubmit={handleSubmit} />;
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
