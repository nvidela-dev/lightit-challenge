import { SVGProps } from 'react';

type HeartbeatIconProps = SVGProps<SVGSVGElement>;

export const HeartbeatIcon = ({ className, ...props }: HeartbeatIconProps) => (
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
    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
  </svg>
);
