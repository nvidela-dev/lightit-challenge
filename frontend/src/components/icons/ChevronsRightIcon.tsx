import { SVGProps } from 'react';

type ChevronsRightIconProps = SVGProps<SVGSVGElement>;

export const ChevronsRightIcon = ({ className, ...props }: ChevronsRightIconProps) => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    className={className}
    {...props}
  >
    <path
      d="M3 4l4 4-4 4M9 4l4 4-4 4"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
