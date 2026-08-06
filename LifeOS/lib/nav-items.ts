import {
  LayoutDashboard,
  ListChecks,
  CalendarDays,
  FileText,
  Target,
  Flame,
  BookOpen,
  BarChart3,
  Settings,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
};

/**
 * Primary navigation config for the Sidebar.
 * This is layout/config data only — no application state or logic lives here.
 */
export const NAV_ITEMS: NavItem[] = [
  { id: "dashboard", label: "Dashboard", href: "/", icon: LayoutDashboard },
  { id: "tasks", label: "Tasks", href: "/tasks", icon: ListChecks },
  { id: "calendar", label: "Calendar", href: "/calendar", icon: CalendarDays },
  { id: "notes", label: "Notes", href: "/notes", icon: FileText },
  { id: "goals", label: "Goals", href: "/goals", icon: Target },
  { id: "habits", label: "Habits", href: "/habits", icon: Flame },
  { id: "journal", label: "Journal", href: "/journal", icon: BookOpen },
  { id: "analytics", label: "Analytics", href: "/analytics", icon: BarChart3 },
];

export const SETTINGS_ITEM: NavItem = {
  id: "settings",
  label: "Settings",
  href: "/settings",
  icon: Settings,
};
