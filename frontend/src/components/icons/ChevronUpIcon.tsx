import { SVGProps } from 'react';

type ChevronUpIconProps = SVGProps<SVGSVGElement>;

export const ChevronUpIcon = ({ className, ...props }: ChevronUpIconProps) => (
  <svg
    viewBox="0 0 10 10"
    fill="none"
    className={className}
    {...props}
  >
    <path
      d="M2 6l3-3 3 3"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
