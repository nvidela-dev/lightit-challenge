import { useEffect, useCallback, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import styles from './Modal.module.css';

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
      className={`${styles.backdrop} ${isClosing ? styles.closing : ''}`}
      onClick={handleClose}
      onAnimationEnd={handleAnimationEnd}
    >
      <div
        className={`${styles.modal} ${isClosing ? styles.closing : ''}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <header className={styles.header}>
          <h2 id="modal-title" className={styles.title}>{title}</h2>
          {!preventClose && (
            <button className={styles.closeButton} onClick={handleClose} aria-label="Close">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          )}
        </header>
        <div className={styles.content}>{children}</div>
      </div>
    </div>,
    modalRoot
  );
};
