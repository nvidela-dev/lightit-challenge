import { useEffect, useCallback, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { XIcon } from './icons';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  preventClose?: boolean;
};

export const Modal = ({ isOpen, onClose, title, children, preventClose = false }: ModalProps) => {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = useCallback(() => {
    if (preventClose) return;
    setIsClosing(true);
  }, [preventClose]);

  const handleAnimationEnd = useCallback(() => {
    if (isClosing) {
      setIsClosing(false);
      onClose();
    }
  }, [isClosing, onClose]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    },
    [handleClose]
  );

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen && !isClosing) return null;

  const modalRoot = document.getElementById('modal-root');
  if (!modalRoot) return null;

  return createPortal(
    <div
      className={`fixed inset-0 bg-black/50 flex items-center justify-center p-5 z-50 ${
        isClosing ? 'animate-fade-out' : 'animate-fade-in'
      }`}
      onClick={handleClose}
      onKeyDown={(e) => e.key === 'Escape' && handleClose()}
      onAnimationEnd={handleAnimationEnd}
      role="button"
      tabIndex={0}
      aria-label="Close modal overlay"
    >
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions */}
      <div
        className={`bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col ${
          isClosing ? 'animate-scale-out' : 'animate-scale-in'
        }`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <header className="flex items-center justify-between px-6 py-5 border-b border-slate-200">
          <h2 id="modal-title" className="text-lg font-semibold text-slate-900">
            {title}
          </h2>
          {!preventClose && (
            <button
              type="button"
              className="flex items-center justify-center w-8 h-8 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-all duration-150"
              onClick={handleClose}
              aria-label="Close"
            >
              <XIcon width={20} height={20} />
            </button>
          )}
        </header>
        <div className="p-6 overflow-y-auto">{children}</div>
      </div>
    </div>,
    modalRoot
  );
};
