import type { ChangeEvent } from 'react';
import styles from './PhoneInput.module.css';

type PhoneInputProps = {
  codeValue: string;
  numberValue: string;
  onCodeChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onNumberChange: (e: ChangeEvent<HTMLInputElement>) => void;
  error?: string;
};

export const PhoneInput = ({
  codeValue,
  numberValue,
  onCodeChange,
  onNumberChange,
  error,
}: PhoneInputProps) => (
  <div className={styles.container}>
    <label className={styles.label}>Phone Number</label>
    <div className={`${styles.inputGroup} ${error ? styles.hasError : ''}`}>
      <input
        type="text"
        value={codeValue}
        onChange={onCodeChange}
        placeholder="+1"
        className={styles.codeInput}
      />
      <input
        type="text"
        value={numberValue}
        onChange={onNumberChange}
        placeholder="1234567890"
        className={styles.numberInput}
      />
    </div>
    <div className={`${styles.errorContainer} ${error ? styles.showError : ''}`}>
      <span className={styles.error}>{error}</span>
    </div>
  </div>
);
