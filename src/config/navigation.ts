export interface NavItem {
  label: string;
  href: string;
}

export const publicNav: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Join IC-EMS", href: "/join" },
];

export const memberNav: NavItem[] = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Calendar", href: "/calendar" },
  { label: "Events", href: "/events" },
  { label: "Training", href: "/training" },
  { label: "Profile", href: "/profile" },
  { label: "Resources", href: "/resources" },
];

export const boardNav: NavItem[] = [
  { label: "Manage Members", href: "/manage-members" },
  { label: "Manage Events", href: "/manage-events" },
  { label: "Manage Training", href: "/manage-training" },
];

export const supervisorNav: NavItem[] = [
  { label: "Assigned Events", href: "/assigned-events" },
];
