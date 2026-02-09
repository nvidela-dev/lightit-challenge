import { SVGProps } from 'react';

type ChevronLeftIconProps = SVGProps<SVGSVGElement>;

export const ChevronLeftIcon = ({ className, ...props }: ChevronLeftIconProps) => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    className={className}
    {...props}
  >
    <path
      d="M10 12L6 8l4-4"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
