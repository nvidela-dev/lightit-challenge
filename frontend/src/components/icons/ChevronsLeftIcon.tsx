import { SVGProps } from 'react';

type ChevronsLeftIconProps = SVGProps<SVGSVGElement>;

export const ChevronsLeftIcon = ({ className, ...props }: ChevronsLeftIconProps) => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    className={className}
    {...props}
  >
    <path
      d="M7 12L3 8l4-4M13 12L9 8l4-4"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
