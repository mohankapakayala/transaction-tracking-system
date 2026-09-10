import { cn } from "@/lib/cn";

/** Decorative bank + mobile-banking illustration for the auth brand panel. */
export function BankingIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 440 350"
      className={cn("w-full", className)}
      aria-hidden
      focusable="false"
    >
      {/* Floating accents */}
      <circle cx="392" cy="112" r="15" fill="#a8bcf0" />
      <circle cx="256" cy="146" r="6" fill="#9fb4ee" />
      <circle cx="238" cy="168" r="3" fill="#9fb4ee" />
      <circle cx="30" cy="212" r="10" fill="#a8bcf0" />
      <circle cx="418" cy="206" r="4" fill="#9fb4ee" />
      <circle cx="66" cy="126" r="4" fill="#9fb4ee" />

      {/* Bank building */}
      <path d="M145 96 254 162 36 162Z" fill="#dbe4fb" />
      <circle cx="145" cy="140" r="11" fill="#f4f7ff" />
      <rect x="46" y="160" width="198" height="19" rx="4" fill="#c3d0f4" />

      <g fill="#dbe4fb">
        <rect x="60" y="179" width="23" height="77" rx="3" />
        <rect x="98" y="179" width="23" height="77" rx="3" />
        <rect x="136" y="179" width="23" height="77" rx="3" />
        <rect x="174" y="179" width="23" height="77" rx="3" />
        <rect x="212" y="179" width="23" height="77" rx="3" />
      </g>
      <g fill="#f4f7ff">
        <rect x="60" y="179" width="8" height="77" rx="3" />
        <rect x="98" y="179" width="8" height="77" rx="3" />
        <rect x="136" y="179" width="8" height="77" rx="3" />
        <rect x="174" y="179" width="8" height="77" rx="3" />
        <rect x="212" y="179" width="8" height="77" rx="3" />
      </g>

      <rect x="46" y="256" width="198" height="17" rx="4" fill="#c3d0f4" />
      <rect x="30" y="273" width="230" height="18" rx="5" fill="#dbe4fb" />

      {/* Mobile banking card */}
      <rect
        x="268"
        y="168"
        width="120"
        height="166"
        rx="18"
        fill="#8fa3e8"
        stroke="#152a63"
        strokeWidth="7"
      />
      <circle cx="328" cy="222" r="25" fill="#dbe4fb" />
      <circle cx="328" cy="214" r="8" fill="#8fa3e8" />
      <path
        d="M312 240a16 16 0 0 1 32 0Z"
        fill="#8fa3e8"
      />
      <rect x="292" y="264" width="72" height="13" rx="6.5" fill="#e7edfc" />
      <rect x="292" y="288" width="48" height="13" rx="6.5" fill="#e7edfc" />
    </svg>
  );
}
