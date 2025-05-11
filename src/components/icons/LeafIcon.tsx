import type { SVGProps } from 'react';

export function LeafIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M11 20A7 7 0 0 1 4 13V7a5 5 0 0 1 5-5h1a5 5 0 0 1 5 5v1" />
      <path d="M15.5 5.5A2.5 2.5 0 0 1 18 8V13a7 7 0 0 1-7 7h-1" />
      <path d="M4 13h16" />
    </svg>
  );
}
