type IconProps = {
  className?: string;
};

/**
 * Shared wrapper for the line icons used across the app shell. Sizing is left
 * to the caller so an icon can sit in a nav row or a page heading unchanged.
 */
function Icon({ className, children }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className ?? "size-5 shrink-0"}
      aria-hidden
      focusable="false"
    >
      {children}
    </svg>
  );
}

export function HomeIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M3.5 10.5 12 4l8.5 6.5V19a1 1 0 0 1-1 1h-4v-5.5h-7V20h-4a1 1 0 0 1-1-1Z" />
    </Icon>
  );
}

export function DocumentIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M14 3H7a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V7Z" />
      <path d="M14 3v4h4" />
    </Icon>
  );
}

export function InboundIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M20 13v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-6" />
      <path d="M4 13h4l1.5 2.5h5L16 13h4" />
      <path d="M12 3v7" />
      <path d="m9 7.5 3 3 3-3" />
    </Icon>
  );
}

export function BellIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M6 9a6 6 0 1 1 12 0c0 3.5 1 5 1.5 5.5h-15C5 15 6 13.5 6 10Z" />
      <path d="M10 18a2 2 0 0 0 4 0" />
    </Icon>
  );
}

export function LayersIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="m12 3 9 4.5-9 4.5-9-4.5Z" />
      <path d="m3 12.5 9 4.5 9-4.5" />
      <path d="m3 17 9 4.5 9-4.5" />
    </Icon>
  );
}

export function ContactsIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="9.5" cy="8" r="3.2" />
      <path d="M3.5 20a6 6 0 0 1 12 0" />
      <path d="M17 8.5h4" />
      <path d="M17 12h4" />
    </Icon>
  );
}

export function EscalationIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="10" cy="8" r="3.2" />
      <path d="M4 20a6 6 0 0 1 10.5-3.9" />
      <path d="M18 13.5v3.5" />
      <path d="M18 20h.01" />
    </Icon>
  );
}

export function UserIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="8" r="3.4" />
      <path d="M5 20a7 7 0 0 1 14 0" />
    </Icon>
  );
}

export function LogoutIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M14 4h4a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-4" />
      <path d="M10 8 6 12l4 4" />
      <path d="M6 12h9" />
    </Icon>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
    </Icon>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="m6 6 12 12" />
      <path d="M18 6 6 18" />
    </Icon>
  );
}
