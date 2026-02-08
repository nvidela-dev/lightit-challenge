import styles from './Spinner.module.css';

type SpinnerProps = {
  size?: 'sm' | 'md' | 'lg';
};

export const Spinner = ({ size = 'md' }: SpinnerProps) => (
  <span className={`${styles.spinner} ${styles[size]}`} />
);
