import { SVGProps } from 'react';

type ChevronRightIconProps = SVGProps<SVGSVGElement>;

export const ChevronRightIcon = ({ className, ...props }: ChevronRightIconProps) => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    className={className}
    {...props}
  >
    <path
      d="M6 4l4 4-4 4"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
