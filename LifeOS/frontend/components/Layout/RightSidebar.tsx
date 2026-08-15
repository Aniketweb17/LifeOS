// frontend/components/Layout/RightSidebar.tsx
import { CalendarDays, ListTodo, CalendarClock, Bell, type LucideIcon } from "lucide-react";

type SidebarSection = {
  id: string;
  title: string;
  icon: LucideIcon;
  emptyLabel: string;
};

const SECTIONS: SidebarSection[] = [
  { id: "calendar", title: "Calendar", icon: CalendarDays, emptyLabel: "No events today" },
  { id: "todays-tasks", title: "Today's Tasks", icon: ListTodo, emptyLabel: "No tasks for today" },
  { id: "upcoming-events", title: "Upcoming Events", icon: CalendarClock, emptyLabel: "No upcoming events" },
  { id: "reminders", title: "Reminders", icon: Bell, emptyLabel: "No reminders" },
];

export default function RightSidebar() {
  return (
    <nav
      aria-label="LYRA daily hub"
      className="flex h-full min-w-0 flex-col overflow-y-auto overflow-x-hidden"
    >
      {SECTIONS.map((section) => (
        <section
          key={section.id}
          aria-label={section.title}
          className="border-b border-border px-6 py-6 last:border-b-0"
        >
          <button
            type="button"
            className="flex w-full items-center gap-2.5 rounded-control text-left transition-colors hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <section.icon size={15} className="shrink-0 text-muted" />
            <span className="font-display text-sm font-semibold tracking-tight text-text">
              {section.title}
            </span>
          </button>

          <p className="mt-2.5 text-xs text-faint">{section.emptyLabel}</p>
        </section>
      ))}
    </nav>
  );
}