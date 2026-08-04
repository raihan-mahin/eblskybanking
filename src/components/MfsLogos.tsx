import type { ReactElement } from "react";

// Lightweight, locally drawn SVG marks approximating the Bangladeshi MFS brands.
// No remote assets, no icon library.

export function BkashMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} role="img" aria-label="bKash">
      <polygon points="6,26 26,18 30,30" fill="#d81b60" />
      <polygon points="26,18 46,14 34,30" fill="#e91e8c" />
      <polygon points="30,30 34,30 30,46" fill="#ad1457" />
      <polygon points="34,30 58,22 44,38" fill="#c2185b" />
      <polygon points="34,30 44,38 30,46" fill="#e5487f" />
      <polygon points="6,26 30,30 16,36" fill="#b0104f" />
    </svg>
  );
}

export function NagadMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} role="img" aria-label="Nagad">
      <circle cx="32" cy="34" r="22" fill="none" stroke="#f4511e" strokeWidth="7" strokeLinecap="round"
        strokeDasharray="104 40" transform="rotate(-40 32 34)" />
      <circle cx="32" cy="34" r="13" fill="none" stroke="#e53935" strokeWidth="6" strokeLinecap="round"
        strokeDasharray="62 24" transform="rotate(130 32 34)" />
      <polygon points="36,6 54,10 48,26 34,20" fill="#fb8c00" />
      <circle cx="32" cy="30" r="3" fill="#e53935" />
      <path d="M32 33 l-4 9 M32 33 l5 8 M27 31 l10 4" stroke="#e53935" strokeWidth="2.6" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export function RocketMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 64" className={className} role="img" aria-label="Rocket">
      <text x="4" y="22" fontSize="15" fontWeight="700" fill="#6a1b9a" fontFamily="Poppins, sans-serif">ROCKET</text>
      <text x="4" y="50" fontSize="24" fontWeight="700" fill="#7b1fa2" fontFamily="Poppins, sans-serif">রকেট</text>
      <polygon points="92,6 116,12 98,22" fill="#8e24aa" />
      <polygon points="92,6 98,22 90,20" fill="#6a1b9a" />
    </svg>
  );
}

export function UpayMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} role="img" aria-label="Upay">
      <circle cx="17" cy="12" r="8" fill="#fdd835" />
      <circle cx="47" cy="12" r="8" fill="#1565c0" />
      <path d="M9 14 v14 a23 23 0 0 0 23 23" fill="none" stroke="#fdd835" strokeWidth="16" strokeLinecap="butt" />
      <path d="M55 14 v14 a23 23 0 0 1 -23 23" fill="none" stroke="#1565c0" strokeWidth="16" strokeLinecap="butt" />
    </svg>
  );
}

export const MFS_MARKS: Record<string, (p: { className?: string }) => ReactElement> = {
  bKash: BkashMark,
  Nagad: NagadMark,
  Rocket: RocketMark,
  Upay: UpayMark,
};
