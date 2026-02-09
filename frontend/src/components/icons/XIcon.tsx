import { SVGProps } from 'react';

type XIconProps = SVGProps<SVGSVGElement>;

export const XIcon = ({ className, ...props }: XIconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);
