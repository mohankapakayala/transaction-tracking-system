import {
  BellIcon,
  ContactsIcon,
  DocumentIcon,
  EscalationIcon,
  HomeIcon,
  InboundIcon,
  LayersIcon,
} from "@/components/common/icons";

export type NavItem = {
  label: string;
  icon: (props: { className?: string }) => React.ReactElement;
  /** Absent while the section has no screen yet — it renders as a placeholder. */
  href?: string;
};

export const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", icon: HomeIcon, href: "/dashboard" },
  { label: "My Documents", icon: DocumentIcon },
  { label: "Inbound Handling", icon: InboundIcon },
  { label: "Notifications", icon: BellIcon },
  { label: "Transactions", icon: LayersIcon },
  { label: "Customer Contacts", icon: ContactsIcon },
  { label: "Escalations", icon: EscalationIcon },
];
