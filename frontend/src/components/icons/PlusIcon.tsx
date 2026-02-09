import { SVGProps } from 'react';

type PlusIconProps = SVGProps<SVGSVGElement>;

export const PlusIcon = ({ className, ...props }: PlusIconProps) => (
  <svg
    viewBox="0 0 12 12"
    fill="none"
    className={className}
    {...props}
  >
    <path
      d="M6 2v8M2 6h8"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);
