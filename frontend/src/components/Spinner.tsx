type SpinnerProps = {
  size?: 'sm' | 'md' | 'lg';
};

const sizeStyles = {
  sm: 'w-4 h-4 border-2',
  md: 'w-6 h-6 border-2',
  lg: 'w-10 h-10 border-3',
};

export const Spinner = ({ size = 'md' }: SpinnerProps) => (
  <span
    className={`inline-block border-slate-200 border-t-primary rounded-full animate-spin-fast ${sizeStyles[size]}`}
  />
);
