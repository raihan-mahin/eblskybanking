import type { ReactElement } from "react";

// Lightweight, locally drawn SVG marks for Bangladeshi mobile operators.
// No remote assets, no icon library.

export function GrameenphoneMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} role="img" aria-label="Grameenphone">
      <g fill="#00b4f0">
        <path d="M32 34C26 24 20 16 14 14c-5-1.6-8 4-4.5 7.6C13 25 22 30 32 34Z" />
        <path d="M32 34c6-10 12-18 18-20 5-1.6 8 4 4.5 7.6C51 25 42 30 32 34Z" />
        <path d="M32 34c-4.5 5-8 11-8 15.5 0 5 6.5 6.5 8.6 2.3C34.6 47.6 33.4 40 32 34Z" fill="#0aa3dc" />
      </g>
    </svg>
  );
}

export function RobiMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} role="img" aria-label="Robi">
      <polygon points="18,12 46,26 18,40" fill="#f7941e" />
      <polygon points="18,40 46,26 46,44 32,52" fill="#e6007e" />
      <polygon points="18,40 32,52 18,52" fill="#c2185b" />
    </svg>
  );
}

export function AirtelMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} role="img" aria-label="Airtel">
      <path
        d="M50 24c0-9-9-13-17-13-11 0-21 8-21 20 0 11 9 19 20 19 4 0 7-1 9-3-8 0-16-6-16-15 0-8 6-14 13-14 5 0 8 3 8 7 0 4-3 7-7 8"
        fill="none"
        stroke="#e40000"
        strokeWidth="9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function BanglalinkMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} role="img" aria-label="Banglalink">
      <rect x="12" y="12" width="40" height="40" rx="7" fill="#f26522" />
      <g stroke="#231f20" strokeWidth="2.4" strokeLinecap="round" fill="none">
        <path d="M18 16c3 8 3 24 0 32" />
        <path d="M24 15c3 9 3 25 0 34" />
        <path d="M30 15c3 9 3 25 0 34" />
        <path d="M36 15c3 9 3 25 0 34" />
        <path d="M42 16c3 8 3 24 0 32" />
        <path d="M47 19c2 6 2 20 0 26" />
      </g>
    </svg>
  );
}

export function TeletalkMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} role="img" aria-label="Teletalk">
      <g fill="#34a853">
        <path d="M18 46c10-2 20-9 26-20 2 6 1 14-4 19-5 5-14 5-22 1Z" />
        <path d="M20 34c8-1 15-6 19-13 1 5 0 10-4 14-4 4-10 3-15-1Z" />
        <path d="M23 23c5 0 10-2 13-6 0 4 0 7-3 10s-7 1-10-4Z" />
      </g>
    </svg>
  );
}

export const OPERATOR_MARKS: Record<string, (p: { className?: string }) => ReactElement> = {
  Grameenphone: GrameenphoneMark,
  Robi: RobiMark,
  Airtel: AirtelMark,
  Banglalink: BanglalinkMark,
  Teletalk: TeletalkMark,
};
